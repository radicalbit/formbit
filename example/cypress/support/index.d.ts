/* eslint-disable no-undef */
import { mount } from 'cypress/react18'

declare global {
    namespace Cypress {
      interface Chainable {
        mount: typeof mount
        button: (text: string) => Cypress.Chainable<JQuery<HTMLElement>>
        getTab: (tab: string) => Cypress.Chainable<JQuery<HTMLElement>>
        shouldSubmit: (...args: unknown[]) => Cypress.Chainable<JQuery<HTMLElement>>
        shouldNotSubmit: () => void
      }
    }
  }
