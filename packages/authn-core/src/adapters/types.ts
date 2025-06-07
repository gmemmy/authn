/**
 * Core authentication adapter interface that handles OTP-based authentication flows.
 *
 * This adapter defines the contract for integrating with various authentication services
 * in React Native applications. Addresses common mobile authentication challenges like
 * network reliability, background app states, and secure token handling.
 *
 * @public
 */
export type AuthnAdapter = {
  /**
   * Sends a one-time password (OTP) to the specified identifier.
   *
   * @param params - The parameters for sending OTP
   * @param params.identifier - User identifier (email, phone number, etc.)
   * @returns Promise that resolves when OTP is sent successfully
   * @throws {Error} When OTP sending fails
   *
   * @example
   * ```typescript
   * await adapter.sendOTP({identifier: 'user@example.com'});
   * ```
   */
  sendOTP(params: {identifier: string}): Promise<void>

  /**
   * Verifies the provided OTP code and returns authentication tokens.
   *
   * @param params - The parameters for OTP verification
   * @param params.identifier - User identifier used when sending OTP
   * @param params.code - The OTP code to verify
   * @returns Promise containing authentication token and expiration info
   * @throws {Error} When verification fails or code is invalid
   *
   * @example
   * ```typescript
   * const result = await adapter.verifyOTP({
   *   identifier: 'user@example.com',
   *   code: '123456'
   * });
   * console.log(result.token); // JWT or session token
   * ```
   */
  verifyOTP(params: {
    identifier: string
    code: string
  }): Promise<{token: string; expiresIn: number}>

  /**
   * Refreshes an existing authentication token.
   *
   * Optional method for token refresh functionality. Implement if your
   * authentication service supports token refresh.
   *
   * @param oldToken - The current token to refresh
   * @returns Promise containing the new token
   * @throws {Error} When token refresh fails
   *
   * @example
   * ```typescript
   * const newToken = await adapter.refreshToken?.(currentToken);
   * ```
   */
  refreshToken?(oldToken: string): Promise<string>

  /**
   * Revokes/invalidates an authentication token.
   *
   * Optional method for token revocation. Implement if your authentication
   * service supports explicit token revocation for logout functionality.
   *
   * @param token - The token to revoke
   * @returns Promise that resolves when token is revoked
   * @throws {Error} When token revocation fails
   *
   * @example
   * ```typescript
   * await adapter.revokeToken?.(token);
   * ```
   */
  revokeToken?(token: string): Promise<void>
}
