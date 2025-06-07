import {AuthnAdapter} from './adapters/types'
import {AuthnStorage} from './storage/types'

/**
 * The main authentication client that orchestrates adapter and storage operations.
 *
 * This client serves as the core of the authentication system, combining
 * an authentication adapter (for API calls) with a storage mechanism (for token persistence).
 *
 * @public
 */
export type AuthnClient = {
  /** The authentication adapter for handling OTP operations */
  adapter: AuthnAdapter
  /** The storage mechanism for token persistence */
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
 * @param opts.storage - The storage implementation for token persistence
 * @returns A configured AuthnClient instance
 *
 * @example
 * ```typescript
 * import {createAuthnClient} from '@your-org/authn-core';
 *
 * const client = createAuthnClient({
 *   adapter: new YourApiAdapter(),
 *   storage: new YourStorageAdapter()
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
