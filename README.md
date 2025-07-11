# authn

![Coverage Badge](https://img.shields.io/badge/coverage-3%25-red)

A comprehensive React Native authentication library engineered for production-grade mobile applications — delivering the secure, flexible, and developer-friendly authentication experience that modern apps demand.


## Why authn?

Current authentication libraries fall short in critical areas:

- **Vendor Lock-In**: Most solutions tie you to specific authentication providers, limiting flexibility and creating migration risks
- **Web-Centric Design**: Libraries built for web often provide suboptimal mobile experiences with poor native integration
- **Inadequate Security**: Lack of hardware-backed secure storage and proper key management exposes sensitive data
- **Complex Biometric Integration**: Implementing biometric authentication remains unnecessarily difficult and error-prone
- **Poor Session Management**: Handling token expiration, refresh cycles, and app lifecycle events is often unreliable
- **Limited Extensibility**: Rigid architectures prevent customization for specific use cases or compliance requirements

## What Makes authn Different

### 🏗️ **Two-Tier Architecture**
- **High-Level Hooks**: Simple, opinionated hooks like `useAuth()` and `signInWithBiometrics()` that cover 80% of use cases
- **Low-Level Primitives**: Granular functions like `encryptToken()`, `refreshTokenWithBackoff()`, and `onAuthEvent()` for complete customization

### 🔐 **Hardware-Backed Security**
- Native integration with iOS Keychain and Android Keystore/StrongBox
- Hardware-backed key rotation with integrity checks
- Audit logging and remote security policy support

### 🔌 **Adapter System**
- Built-in adapters for Firebase Auth, Auth0, and custom OAuth2 providers
- Pluggable storage layers (SecureStore, MMKV, custom implementations)
- Swappable HTTP clients (Fetch, Axios, custom)

## Core Features

- **Mobile-First Architecture**: Built specifically for React Native with native performance and UX patterns
- **Secure by Default**: Hardware-backed token storage with automatic encryption and key management
- **Seamless Biometric Support**: Face ID, Touch ID, and biometric fallback flows with zero configuration
- **Resilient Session Handling**: Intelligent token refresh, network retry logic, and app lifecycle management
- **Flexible Integration**: Adapter-based design prevents vendor lock-in while supporting popular auth providers
- **Production Ready**: Comprehensive error handling, edge case management, and security best practices

## License

MIT
