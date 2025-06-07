# authn

![Coverage Badge](https://img.shields.io/badge/coverage-3%25-red)

A React Native authentication library designed for mobile-first OTP flows — solving the pain points that other authentication libraries ignore.

## Why authn?

- **Vendor Lock-In**: Many authentication services tie you to their ecosystem, limiting flexibility and customization.
- **Web-Centric Design**: Traditional libraries often prioritize web applications, leading to subpar mobile experiences.
- **Inadequate Security**: Lack of secure token storage mechanisms can expose sensitive data on mobile devices.
- **Complex Biometric Integration**: Implementing biometric authentication is often non-trivial or unsupported.
- **Poor Session Management**: Challenges in handling token expiration and app lifecycle events can disrupt user sessions.

Authn gives you the authentication hooks you actually want — with secure storage, network resilience, and mobile-optimized user experiences built in from day one.

## Core Features

- **Mobile-First Architecture**: Designed from the ground up for React Native, ensuring optimal performance and user experience.
- **Secure by Default**: Leverages native secure storage solutions to protect authentication tokens.
- **Seamless Biometric Support**: Simplifies the integration of biometric authentication methods like Face ID and Touch ID.
- **Resilient Session Handling**: Manages token refresh and session persistence effectively, even during app backgrounding or network issues.
- **Flexible Integration**: Adapter-based design allows easy integration with various authentication backends, avoiding vendor lock-in.
