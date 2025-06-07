import * as React from 'react'
import {AuthnContext} from '../context/AuthnContext'
import {AuthnSession} from '../types/session'
import {
  createSession,
  isSessionExpired,
  isSessionExpiringSoon,
} from '../utils/session'

/**
 * Custom React hook for authentication functionality.
 *
 * This hook provides a complete authentication interface including OTP sending,
 * verification, token management, and authentication state. It must be used within
 * an AuthnProvider component.
 *
 * @returns Authentication state and methods
 *
 * @throws {Error} When used outside of AuthnProvider
 * @public
 */
export function useAuthn() {
  const {client} = React.useContext(AuthnContext)
  const [session, setSession] = React.useState<AuthnSession | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [status, setStatus] = React.useState<
    'idle' | 'sending' | 'verifying' | 'authenticated' | 'error'
  >('idle')

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // Clear session and update storage
  const clearSession = React.useCallback(async () => {
    setSession(null)
    setStatus('idle')
    try {
      await client.storage.removeSession()
    } catch (err) {
      console.warn('Failed to remove session from storage:', err)
    }
  }, [client.storage])

  // Handle session expiration
  const handleSessionExpired = React.useCallback(async () => {
    await clearSession()
    setError(new Error('Session expired'))
  }, [clearSession])

  // Try to refresh token if adapter supports it
  const tryRefreshToken = React.useCallback(
    async (currentSession: AuthnSession) => {
      if (!client.adapter.refreshToken) return false

      try {
        const newToken = await client.adapter.refreshToken(currentSession.token)
        // Assume same expiration time as original for now
        const refreshedSession = {
          ...currentSession,
          token: newToken,
          expiresAt: currentSession.expiresAt
            ? Date.now() + (currentSession.expiresAt - Date.now())
            : undefined,
        }
        setSession(refreshedSession)
        await client.storage.setSession(refreshedSession)
        return true
      } catch (err) {
        console.warn('Token refresh failed:', err)
        return false
      }
    },
    [client.adapter, client.storage]
  )

  // Monitor session expiration
  const startExpirationMonitor = React.useCallback(
    (currentSession: AuthnSession) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(async () => {
        if (isSessionExpired(currentSession)) {
          await handleSessionExpired()
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        } else if (isSessionExpiringSoon(currentSession, 300000)) {
          // 5 minutes
          const refreshed = await tryRefreshToken(currentSession)
          if (!refreshed) {
            // If refresh failed and we're very close to expiry, logout
            if (isSessionExpiringSoon(currentSession, 60000)) {
              // 1 minute
              await handleSessionExpired()
              if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
              }
            }
          }
        }
      }, 30000) // Check every 30 seconds
    },
    [handleSessionExpired, tryRefreshToken]
  )

  // Stop expiration monitor
  const stopExpirationMonitor = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Hydrate session on load
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        const storedSession = await client.storage.getSession()

        if (!storedSession) {
          setStatus('idle')
          return
        }

        // Check if stored session is expired
        if (isSessionExpired(storedSession)) {
          await clearSession()
          return
        }

        setSession(storedSession)
        setStatus('authenticated')
        startExpirationMonitor(storedSession)
      } catch (err) {
        setError(err as Error)
        setStatus('error')
      }
    }

    hydrate()

    // Cleanup on unmount
    return () => {
      stopExpirationMonitor()
    }
  }, [
    client.storage,
    clearSession,
    startExpirationMonitor,
    stopExpirationMonitor,
  ])

  /**
   * Sends an OTP to the specified identifier.
   *
   * @param identifier - User identifier (email, phone, etc.)
   * @throws {Error} When OTP sending fails
   */
  const sendOTP = async (identifier: string) => {
    setStatus('sending')
    setError(null)
    try {
      await client.adapter.sendOTP({identifier})
      setStatus('idle')
    } catch (err) {
      setError(err as Error)
      setStatus('error')
    }
  }

  /**
   * Verifies the provided OTP code and authenticates the user.
   *
   * @param identifier - User identifier used when sending OTP
   * @param code - The OTP code to verify
   * @throws {Error} When verification fails
   */
  const verifyOTP = async (identifier: string, code: string) => {
    setStatus('verifying')
    setError(null)
    try {
      const result = await client.adapter.verifyOTP({identifier, code})
      const newSession = createSession(result.token, result.expiresIn)

      setSession(newSession)
      await client.storage.setSession(newSession)
      setStatus('authenticated')

      startExpirationMonitor(newSession)
    } catch (err) {
      setError(err as Error)
      setStatus('error')
    }
  }

  /**
   * Logs out the current user by removing the stored session.
   *
   * @throws {Error} When logout fails
   */
  const logout = async () => {
    stopExpirationMonitor()

    // Try to revoke token if adapter supports it
    if (session?.token && client.adapter.revokeToken) {
      try {
        await client.adapter.revokeToken(session.token)
      } catch (err) {
        console.warn('Token revocation failed:', err)
      }
    }

    await clearSession()
  }

  return {
    /** The current authentication session, if any */
    session,
    /** Current authentication flow status */
    status,
    /** Whether the user is currently authenticated */
    isAuthenticated: !!session && !isSessionExpired(session),
    /** Function to send OTP to an identifier */
    sendOTP,
    /** Function to verify OTP code */
    verifyOTP,
    /** Function to log out the current user */
    logout,
    /** Any error that occurred during authentication */
    error,
  }
}
