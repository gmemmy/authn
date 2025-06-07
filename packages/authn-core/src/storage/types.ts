import {AuthnSession} from '../types/session'

/**
 * Storage interface for persisting authentication sessions in React Native applications.
 *
 * This interface addresses React Native-specific security requirements and storage challenges.
 * Implementations should use secure storage mechanisms like Keychain (iOS) or Keystore (Android)
 * to protect sensitive authentication data from device compromise and app sandboxing.
 *
 * @public
 */
export type AuthnStorage = {
  /**
   * Retrieves the stored authentication session from secure device storage.
   *
   * Should handle React Native app lifecycle events and device security states.
   * Considers biometric unlock requirements and keychain/keystore availability.
   *
   * @returns Promise containing the stored session, or null if no session exists or device is locked
   * @throws {Error} When session retrieval fails due to device security or storage issues
   *
   * @example
   * ```typescript
   * // Retrieve session considering device lock state
   * const session = await storage.getSession();
   * if (session) {
   *   // User authenticated, navigate to main app
   *   navigation.navigate('MainTabs');
   * } else {
   *   // Show authentication screen
   *   navigation.navigate('Auth');
   * }
   * ```
   */
  getSession(): Promise<AuthnSession | null>

  /**
   * Stores an authentication session securely using React Native secure storage.
   *
   * Utilizes platform-specific secure storage (iOS Keychain, Android Keystore)
   * with appropriate security levels and biometric protection when available.
   * Handles storage limitations and device security policy compliance.
   *
   * @param session - The authentication session to store securely
   * @returns Promise that resolves when session is stored successfully
   * @throws {Error} When secure storage fails or device security policies prevent storage
   *
   * @example
   * ```typescript
   * // Store session with biometric protection
   * await storage.setSession(authSession);
   * // Session now protected by device security
   * ```
   */
  setSession(session: AuthnSession): Promise<void>

  /**
   * Removes the stored authentication session from secure device storage.
   *
   * Ensures complete cleanup of authentication data during logout,
   * addressing React Native security requirements and app store policies.
   * Handles cases where storage may be inaccessible due to device state.
   *
   * @returns Promise that resolves when session is removed successfully
   * @throws {Error} When session removal fails or storage is inaccessible
   *
   * @example
   * ```typescript
   * // Complete logout flow
   * await storage.removeSession();
   * // Clear navigation stack and return to auth
   * navigation.reset({
   *   index: 0,
   *   routes: [{name: 'AuthStack'}],
   * });
   * ```
   */
  removeSession(): Promise<void>
}
