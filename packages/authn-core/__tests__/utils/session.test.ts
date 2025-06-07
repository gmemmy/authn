import {describe, it, expect, beforeEach, vi} from 'vitest'
import {
  createSession,
  isSessionExpired,
  isSessionExpiringSoon,
  getTimeUntilExpiration,
} from '../../src/utils/session'
import type {AuthnSession} from '../../src/types/session'

describe('Session Utils', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })

  describe('createSession', () => {
    it('should create session with correct expiration timestamp', () => {
      const token = 'test-token'
      const expiresIn = 3600 // 1 hour

      const session = createSession(token, expiresIn)

      expect(session).toEqual({
        token: 'test-token',
        expiresAt: Date.now() + 3600 * 1000,
      })
    })

    it('should handle zero expiration time', () => {
      const session = createSession('token', 0)
      expect(session.expiresAt).toBe(Date.now())
    })

    it('should handle large expiration times', () => {
      const session = createSession('token', 86400) // 24 hours
      expect(session.expiresAt).toBe(Date.now() + 86400 * 1000)
    })
  })

  describe('isSessionExpired', () => {
    it('should return false for null session', () => {
      expect(isSessionExpired(null)).toBe(false)
    })

    it('should return false for session without expiration', () => {
      const session: AuthnSession = {token: 'test'}
      expect(isSessionExpired(session)).toBe(false)
    })

    it('should return false for valid session', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() + 1000, // 1 second from now
      }
      expect(isSessionExpired(session)).toBe(false)
    })

    it('should return true for expired session', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() - 1000, // 1 second ago
      }
      expect(isSessionExpired(session)).toBe(true)
    })

    it('should return true for session expiring exactly now', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now(),
      }
      expect(isSessionExpired(session)).toBe(true)
    })
  })

  describe('isSessionExpiringSoon', () => {
    it('should return false for null session', () => {
      expect(isSessionExpiringSoon(null)).toBe(false)
    })

    it('should return false for session without expiration', () => {
      const session: AuthnSession = {token: 'test'}
      expect(isSessionExpiringSoon(session)).toBe(false)
    })

    it('should return false for session expiring beyond threshold', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() + 120000, // 2 minutes (beyond 1 minute default)
      }
      expect(isSessionExpiringSoon(session)).toBe(false)
    })

    it('should return true for session expiring within default threshold', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() + 30000, // 30 seconds (within 1 minute default)
      }
      expect(isSessionExpiringSoon(session)).toBe(true)
    })

    it('should return true for session expiring within custom threshold', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() + 150000, // 2.5 minutes
      }
      expect(isSessionExpiringSoon(session, 180000)).toBe(true) // 3 minute threshold
    })

    it('should return true for already expired session', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() - 1000, // Already expired
      }
      expect(isSessionExpiringSoon(session)).toBe(true)
    })
  })

  describe('getTimeUntilExpiration', () => {
    it('should return 0 for null session', () => {
      expect(getTimeUntilExpiration(null)).toBe(0)
    })

    it('should return 0 for session without expiration', () => {
      const session: AuthnSession = {token: 'test'}
      expect(getTimeUntilExpiration(session)).toBe(0)
    })

    it('should return correct time for valid session', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() + 30000, // 30 seconds
      }
      expect(getTimeUntilExpiration(session)).toBe(30000)
    })

    it('should return 0 for expired session', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now() - 1000, // Expired
      }
      expect(getTimeUntilExpiration(session)).toBe(0)
    })

    it('should handle edge case of expiration exactly now', () => {
      const session: AuthnSession = {
        token: 'test',
        expiresAt: Date.now(),
      }
      expect(getTimeUntilExpiration(session)).toBe(0)
    })
  })
})
