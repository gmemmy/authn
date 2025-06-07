/**
 * Storage interface for persisting authentication tokens.
 *
 * This interface defines how authentication tokens are stored, retrieved, and managed.
 * Implement this interface to integrate with different storage mechanisms like
 * AsyncStorage, secure storage, or custom storage solutions.
 *
 * @public
 */
export type AuthnStorage = {
  /**
   * Retrieves the stored authentication token.
   *
   * @returns Promise containing the stored token, or null if no token exists
   * @throws {Error} When token retrieval fails
   *
   * @example
   * ```typescript
   * const token = await storage.getToken();
   * if (token) {
   *   // User is authenticated
   * }
   * ```
   */
  getToken(): Promise<string | null>

  /**
   * Stores an authentication token securely.
   *
   * @param token - The authentication token to store
   * @returns Promise that resolves when token is stored successfully
   * @throws {Error} When token storage fails
   *
   * @example
   * ```typescript
   * await storage.setToken('jwt-token-here');
   * ```
   */
  setToken(token: string): Promise<void>

  /**
   * Removes the stored authentication token.
   *
   * This method should clean up any stored authentication data
   * and is typically called during logout operations.
   *
   * @returns Promise that resolves when token is removed successfully
   * @throws {Error} When token removal fails
   *
   * @example
   * ```typescript
   * await storage.removeToken(); // User logged out
   * ```
   */
  removeToken(): Promise<void>
}
