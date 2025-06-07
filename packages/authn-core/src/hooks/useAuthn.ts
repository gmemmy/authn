import * as React from 'react'
import {AuthnContext} from '../context/AuthnContext'

/**
 * Custom React hook for authentication functionality.
 *
 * This hook provides a complete authentication interface including OTP sending,
 * verification, token management, and authentication state. It must be used within
 * an AuthnProvider component.
 *
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * import {useAuthn} from '@your-org/authn-core';
 *
 * function LoginForm() {
 *   const {sendOTP, verifyOTP, status, isAuthenticated, error} = useAuthn();
 *
 *   const handleSendOTP = async () => {
 *     await sendOTP('user@example.com');
 *   };
 *
 *   const handleVerifyOTP = async (code: string) => {
 *     await verifyOTP('user@example.com', code);
 *   };
 *
 *   if (isAuthenticated) {
 *     return <div>Welcome! You are logged in.</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleSendOTP} disabled={status === 'sending'}>
 *         {status === 'sending' ? 'Sending...' : 'Send OTP'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @throws {Error} When used outside of AuthnProvider
 * @public
 */
export function useAuthn() {
  const {client} = React.useContext(AuthnContext)

  const [status, setStatus] = React.useState<
    'idle' | 'sending' | 'verifying' | 'authenticated' | 'error'
  >('idle')
  const [token, setToken] = React.useState<string | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    client.storage.getToken().then(setToken)
  }, [])

  /**
   * Sends an OTP to the specified identifier.
   *
   * @param identifier - User identifier (email, phone, etc.)
   * @throws {Error} When OTP sending fails
   */
  const sendOTP = async (identifier: string) => {
    setStatus('sending')
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
    try {
      const {token} = await client.adapter.verifyOTP({identifier, code})
      await client.storage.setToken(token)
      setToken(token)
      setStatus('authenticated')
    } catch (err) {
      setError(err as Error)
      setStatus('error')
    }
  }

  /**
   * Logs out the current user by removing the stored token.
   *
   * @throws {Error} When logout fails
   */
  const logout = async () => {
    await client.storage.removeToken()
    setToken(null)
    setStatus('idle')
  }

  return {
    /** The current authentication token, if any */
    token,
    /** Current authentication flow status */
    status,
    /** Whether the user is currently authenticated */
    isAuthenticated: !!token,
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
