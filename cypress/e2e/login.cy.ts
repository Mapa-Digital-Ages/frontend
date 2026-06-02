describe('Página de Login - Fluxos do Front-end', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const perfis = [
    { perfil: 'aluno', rota: '/student/' },
    { perfil: 'responsavel', rota: '/parent/' },
    { perfil: 'admin', rota: '/admin/' },
    { perfil: 'empresa', rota: '/company/' },
    { perfil: 'escola', rota: '/school/' },
    { perfil: 'escola_empresa', rota: '/school-company/' },
  ]

  perfis.forEach(({ perfil, rota }) => {
    it(`deve logar com sucesso como ${perfil.toUpperCase()}`, () => {
      cy.login(perfil as any)
      cy.location('pathname').should('include', rota)
    })
  })
})
