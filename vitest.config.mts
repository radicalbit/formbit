import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // The root tsconfig sets jsx: "preserve" so microbundle/Babel can handle the
  // JSX in formbit-context.tsx at build time. Vite's own transformer refuses
  // "preserve", so let the React plugin handle JSX for tests instead.
  plugins: [react()],
  test: {
    // The suites rely on bare describe/it/expect and on `jest.fn`, which is
    // aliased to `vi` below, so no per-file imports are needed.
    globals: true,
    environment: 'jsdom',
    // Match everything under __tests__, not just *.test.*: miscellaneous.ts
    // holds a real test and CRA's jest picked it up by directory convention.
    include: ['src/__tests__/**/*.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts']
  },
  resolve: {
    alias: {
      // Mirrors tsconfig `baseUrl: "."`, which is how `import ... from
      // 'src/use-formbit'` resolved under react-scripts.
      src: fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
