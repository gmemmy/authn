import * as React from 'react'
import {AuthnClient} from '../createClient'

/**
 * React Context for sharing the authentication client throughout the component tree.
 *
 * This context provides access to the AuthnClient instance across your React Native application.
 * Use the AuthnProvider component to provide the client and useAuthn hook to consume it.
 *
 * @internal
 */
export const AuthnContext = React.createContext<{client: AuthnClient}>({
  client: null as unknown as AuthnClient,
})

/**
 * React Provider component that makes the authentication client available to child components.
 *
 * Wrap your application or the part of your app that needs authentication
 * with this provider. All child components will have access to the authentication
 * functionality through the useAuthn hook.
 *
 * @param props - The provider props
 * @param props.client - The configured AuthnClient instance
 * @param props.children - Child components that will have access to authentication
 * @returns JSX provider component
 *
 * @example
 * ```tsx
 * import {AuthnProvider, createAuthnClient} from '@your-org/authn-core';
 *
 * const client = createAuthnClient({
 *   adapter: myAdapter,
 *   storage: myStorage
 * });
 *
 * function App() {
 *   return (
 *     <AuthnProvider client={client}>
 *       <YourApp />
 *     </AuthnProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export const AuthnProvider = ({
  children,
  client,
}: {
  client: AuthnClient
  children: React.ReactNode
}) => {
  return (
    <AuthnContext.Provider value={{client}}>{children}</AuthnContext.Provider>
  )
}
