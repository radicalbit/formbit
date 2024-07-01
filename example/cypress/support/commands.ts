/// <reference types="./index.ts" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

const getTab = (tab: string) => cy.get('[role="tab"]').contains(tab, { matchCase: false })

const shouldSubmit = (...args: unknown[]) => cy.get('@console-log').should('be.calledWith', 'Submitted Form', ...args)

const shouldNotSubmit = () => { cy.get('@console-log').should('not.be.called') }

const button = (text: string) => cy.get('button').contains(text, { matchCase: false }).parent()

Cypress.Commands.addAll({ button, getTab, shouldSubmit, shouldNotSubmit })
