import {beforeAll, afterAll, vi} from 'vitest'
import '@testing-library/jest-dom'

// Mock console methods to avoid noise in tests
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  console.warn = vi.fn()
  console.error = vi.fn()
})

afterAll(() => {
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

// Mock timers for session expiration tests
vi.useFakeTimers()
