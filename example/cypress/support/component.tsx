/// <reference types="./index.d.ts" />

/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import { mount } from 'cypress/react18'

// Alternatively you can use CommonJS syntax:
// require('./commands')

global.process = global.process || {}
global.process.env = global.process.env || {}

Cypress.Commands.add('mount', mount)

beforeEach(() => {
  cy.spy(window.console, 'log').as('console-log')
})

// Example use:
// cy.mount(<MyComponent />)
