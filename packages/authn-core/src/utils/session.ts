import {AuthnSession} from '../types/session'

/**
 * Creates a session with expiration timestamp calculated from expiresIn seconds
 */
export function createSession(token: string, expiresIn: number): AuthnSession {
  const expiresAt = Date.now() + expiresIn * 1000
  return {token, expiresAt}
}

/**
 * Checks if a session is expired based on current time
 */
export function isSessionExpired(session: AuthnSession | null): boolean {
  if (!session?.expiresAt) return false
  return session.expiresAt <= Date.now()
}

/**
 * Checks if a session will expire within the given threshold (in milliseconds)
 * Useful for proactive token refresh
 */
export function isSessionExpiringSoon(
  session: AuthnSession | null,
  thresholdMs: number = 60000 // 1 minute default
): boolean {
  if (!session?.expiresAt) return false
  return session.expiresAt <= Date.now() + thresholdMs
}

/**
 * Gets time remaining until session expiration in milliseconds
 * Returns 0 if session is expired or has no expiration
 */
export function getTimeUntilExpiration(session: AuthnSession | null): number {
  if (!session?.expiresAt) return 0
  const remaining = session.expiresAt - Date.now()
  return Math.max(0, remaining)
}
