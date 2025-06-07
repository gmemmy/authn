import {vi} from 'vitest'
import type {AuthnAdapter} from '../../src/adapters/types'
import type {AuthnStorage} from '../../src/storage/types'
import type {AuthnSession} from '../../src/types/session'

/**
 * Mock adapter for testing
 */
export class MockAdapter implements AuthnAdapter {
  public sendOTPMock = vi.fn()
  public verifyOTPMock = vi.fn()
  public refreshTokenMock = vi.fn()
  public revokeTokenMock = vi.fn()

  async sendOTP(params: {identifier: string}): Promise<void> {
    return this.sendOTPMock(params)
  }

  async verifyOTP(params: {
    identifier: string
    code: string
  }): Promise<{token: string; expiresIn: number}> {
    return this.verifyOTPMock(params)
  }

  async refreshToken(oldToken: string): Promise<string> {
    return this.refreshTokenMock(oldToken)
  }

  async revokeToken(token: string): Promise<void> {
    return this.revokeTokenMock(token)
  }

  // Helper methods for test setup
  mockSuccessfulSendOTP() {
    this.sendOTPMock.mockResolvedValue(undefined)
  }

  mockSuccessfulVerifyOTP(token = 'test-token', expiresIn = 3600) {
    this.verifyOTPMock.mockResolvedValue({token, expiresIn})
  }

  mockSuccessfulRefresh(newToken = 'refreshed-token') {
    this.refreshTokenMock.mockResolvedValue(newToken)
  }

  mockFailedOperation(error = new Error('Operation failed')) {
    this.sendOTPMock.mockRejectedValue(error)
    this.verifyOTPMock.mockRejectedValue(error)
    this.refreshTokenMock.mockRejectedValue(error)
    this.revokeTokenMock.mockRejectedValue(error)
  }
}

/**
 * Mock storage for testing
 */
export class MockStorage implements AuthnStorage {
  public getSessionMock = vi.fn()
  public setSessionMock = vi.fn()
  public removeSessionMock = vi.fn()
  public getTokenMock = vi.fn()
  public setTokenMock = vi.fn()
  public removeTokenMock = vi.fn()

  private storage = new Map<string, AuthnSession | string>()

  async getSession(): Promise<AuthnSession | null> {
    const result = await this.getSessionMock()
    return result ?? (this.storage.get('session') as AuthnSession) ?? null
  }

  async setSession(session: AuthnSession): Promise<void> {
    this.storage.set('session', session)
    return this.setSessionMock(session)
  }

  async removeSession(): Promise<void> {
    this.storage.delete('session')
    return this.removeSessionMock()
  }

  async getToken(): Promise<string | null> {
    const result = await this.getTokenMock()
    return result ?? (this.storage.get('token') as string) ?? null
  }

  async setToken(token: string): Promise<void> {
    this.storage.set('token', token)
    return this.setTokenMock(token)
  }

  async removeToken(): Promise<void> {
    this.storage.delete('token')
    return this.removeTokenMock()
  }

  // Helper methods for test setup
  mockStoredSession(session: AuthnSession | null) {
    this.getSessionMock.mockResolvedValue(session)
  }

  mockEmptyStorage() {
    this.getSessionMock.mockResolvedValue(null)
    this.getTokenMock.mockResolvedValue(null)
  }

  mockStorageError(error = new Error('Storage error')) {
    this.getSessionMock.mockRejectedValue(error)
    this.setSessionMock.mockRejectedValue(error)
    this.removeSessionMock.mockRejectedValue(error)
  }

  // Get stored data for assertions
  getStoredSession(): AuthnSession | null {
    return (this.storage.get('session') as AuthnSession) ?? null
  }

  clear() {
    this.storage.clear()
    vi.clearAllMocks()
  }
}
