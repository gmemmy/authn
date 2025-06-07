import {AuthnAdapter} from './adapters/types'
import {AuthnStorage} from './storage/types'

/**
 * The main authentication client that orchestrates adapter and storage operations.
 *
 * This client orchestrates mobile-optimized authentication flows by combining
 * an authentication adapter (for API calls) with secure device storage (for session persistence).
 * Designed to handle React Native-specific challenges like app backgrounding, network
 * connectivity issues, and secure session management across platform differences.
 *
 * @public
 */
export type AuthnClient = {
  /** The authentication adapter for handling OTP operations */
  adapter: AuthnAdapter
  /** The secure storage mechanism for session persistence */
  storage: AuthnStorage
}

/**
 * Creates a new authentication client instance.
 *
 * This is the primary factory function for creating an authentication client.
 * Combine your chosen adapter and storage implementations to create a fully
 * functional authentication system.
 *
 * @param opts - Configuration options for the client
 * @param opts.adapter - The authentication adapter implementation
 * @param opts.storage - The storage implementation for session persistence
 * @returns A configured AuthnClient instance
 *
 * @example
 * ```typescript
 * import {createAuthnClient} from '@your-org/authn-core';
 * import {SecureStorageAdapter} from './storage';
 * import {ApiAdapter} from './api';
 *
 * const client = createAuthnClient({
 *   adapter: new ApiAdapter({
 *     baseUrl: 'https://api.yourapp.com',
 *     timeout: 10000 // Handle mobile network delays
 *   }),
 *   storage: new SecureStorageAdapter({
 *     service: 'your-app-auth',
 *     requireBiometrics: true
 *   })
 * });
 * ```
 *
 * @public
 */
export function createAuthnClient(opts: {
  adapter: AuthnAdapter
  storage: AuthnStorage
}): AuthnClient {
  return {
    adapter: opts.adapter,
    storage: opts.storage,
  }
}
