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

type PerfisSuportados =
  | 'aluno'
  | 'responsavel'
  | 'admin'
  | 'empresa'
  | 'escola'
  | 'escola_empresa'

export {}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      login(perfil: PerfisSuportados): Chainable<void>
      getBySel(
        selector: string,
        ...args: unknown[]
      ): Chainable<JQuery<HTMLElement>>
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

Cypress.Commands.add('getBySel', (selector: string, ...args: unknown[]) => {
  return cy.get(`[data-testid="${selector}"]`, ...args)
})
Cypress.Commands.add('login', (perfil: PerfisSuportados) => {
  const credentials: Record<
    PerfisSuportados,
    { email: string | undefined; senha: string | undefined }
  > = {
    aluno: {
      email: Cypress.env('EMAIL_LOGIN_ALUNO'),
      senha: Cypress.env('PASSWORD_LOGIN_ALUNO'),
    },
    responsavel: {
      email: Cypress.env('EMAIL_LOGIN_RESPONSAVEL'),
      senha: Cypress.env('PASSWORD_LOGIN_RESPONSAVEL'),
    },
    admin: {
      email: Cypress.env('EMAIL_LOGIN_ADMIN'),
      senha: Cypress.env('PASSWORD_LOGIN_ADMIN'),
    },
    empresa: {
      email: Cypress.env('EMAIL_LOGIN_EMPRESA'),
      senha: Cypress.env('PASSWORD_LOGIN_EMPRESA'),
    },
    escola: {
      email: Cypress.env('EMAIL_LOGIN_ESCOLA'),
      senha: Cypress.env('PASSWORD_LOGIN_ESCOLA'),
    },
    escola_empresa: {
      email: Cypress.env('EMAIL_LOGIN_ESCOLA_EMPRESA'),
      senha: Cypress.env('PASSWORD_LOGIN_ESCOLA_EMPRESA'),
    },
  }

  const { email, senha } = credentials[perfil]

  if (!email || !senha) {
    throw new Error(
      `Configuração não encontrada para o perfil: ${perfil}. Variáveis de ambiente não correspondem.`
    )
  }

  cy.getBySel('input-email', { timeout: 15000 })
    .should('be.visible')
    .type(email)
  cy.getBySel('input-password').should('be.visible').type(senha, { log: false })
  cy.getBySel('button-login').should('be.visible').click()
})
