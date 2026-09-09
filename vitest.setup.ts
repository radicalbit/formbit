import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// The suites were written against Jest and use `jest.fn()`. Vitest's `vi` is
// API-compatible for that usage, so expose it under the old global instead of
// rewriting every call site.
declare global {
  var jest: typeof vi
}

globalThis.jest = vi
