describe('Página de Login - Fluxos do Front-end', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve logar com sucesso como ALUNO', () => {
    cy.login('aluno')
    cy.url().should('include', '/student/')
    cy.url().should('not.include', '/admin')
    cy.url().should('not.include', '/parent')
    cy.url().should('not.include', '/school')
    cy.url().should('not.include', '/company')
  })
})
