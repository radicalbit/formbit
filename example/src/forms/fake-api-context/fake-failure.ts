const FAILURE_RATE = 0.2

declare global {
  interface Window {
    Cypress?: unknown
    /**
     * Set by the specs to force the fake API outcome. Only honoured under
     * Cypress, so running the app keeps the random behaviour.
     */
    __fakeApiShouldFail?: boolean
  }
}

const isCypress = () => typeof window !== 'undefined' && !!window.Cypress

/**
 * Decides whether a fake request fails.
 *
 * Running the app it fails at random, which is the point: it demos the error
 * and retry UI. Under Cypress that randomness made edit-like.cy.tsx fail ~20%
 * of runs, so there the outcome is deterministic: success unless a spec opts
 * into failure via `window.__fakeApiShouldFail`.
 */
export const shouldFakeRequestFail = (): boolean => {
  if (isCypress()) {
    return window.__fakeApiShouldFail === true
  }

  return Math.random() < FAILURE_RATE
}
