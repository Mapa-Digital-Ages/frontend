describe('Página de Login - Fluxos do Front-end', () => {
  type PerfisSuportados =
    | 'aluno'
    | 'responsavel'
    | 'admin'
    | 'empresa'
    | 'escola'
    | 'escola_empresa'

  beforeEach(() => {
    cy.visit('/')
  })

  const perfis: Array<{ perfil: PerfisSuportados; rota: string }> = [
    { perfil: 'aluno', rota: '/student/' },
    { perfil: 'responsavel', rota: '/parent/' },
    { perfil: 'admin', rota: '/admin/' },
    { perfil: 'empresa', rota: '/company/' },
    { perfil: 'escola', rota: '/school/' },
    { perfil: 'escola_empresa', rota: '/school-company/' },
  ]

  perfis.forEach(({ perfil, rota }) => {
    it(`deve logar com sucesso como ${perfil.toUpperCase()}`, () => {
      cy.login(perfil)
      cy.location('pathname').should('include', rota)
    })
  })
})
