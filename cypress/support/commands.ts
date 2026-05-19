/// <reference types="cypress" />
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

type PerfisSuportados = 'aluno'

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      login(perfil: PerfisSuportados): Chainable<void>
      getBySel(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args)
})

Cypress.Commands.add('login', (perfil: PerfisSuportados) => {
  const email = Cypress.env('EMAIL_LOGIN_ALUNO')
  const senha = Cypress.env('PASSWORD_LOGIN_ALUNO')

  if (!email || !senha) {
    throw new Error(
      `Configuração não encontrada para o perfil: ${perfil}. EMAIL_LOGIN_ALUNO ou PASSWORD_LOGIN_ALUNO estão undefined.`
    )
  }

  cy.getBySel('input-email', { timeout: 15000 })
    .should('be.visible')
    .type(email)
  cy.getBySel('input-password').should('be.visible').type(senha, { log: false })
  cy.getBySel('button-login').should('be.visible').click()
  cy.location('pathname', { timeout: 15000 }).should('eq', '/dashboard')
})
