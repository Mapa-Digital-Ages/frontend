describe('Página de Login - Fluxos do Front-end', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve logar com sucesso como ALUNO', () => {
    cy.login('aluno')
  })
})
