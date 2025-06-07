/**
 * Represents a user session with authentication token and optional expiration.
 *
 * This type defines the structure of a user session, including the authentication
 * token and an optional expiration timestamp. It can be extended with additional
 * properties to store additional session-related data.
 *
 * @public
 */
export type AuthnSession = {
  token: string
  expiresAt?: number
  [key: string]: unknown
}
