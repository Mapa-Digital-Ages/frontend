describe('Página de Recuperação de Senha - Fluxos do Front-end', () => {
  beforeEach(() => {
    cy.visit('/forgot-password')
  })

  it('renderiza os componentes principais', () => {
    cy.get('input[placeholder="voce@exemplo.com"]').should('be.visible')
    cy.contains('Enviar link').should('be.visible')
    cy.contains('Voltar ao login').should('be.visible')
  })

  it('mostra mensagem de erro para e-mail inválido', () => {
    cy.get('input[placeholder="voce@exemplo.com"]').type('nao-e-um-email')
    cy.contains('Enviar link').click()
    cy.contains('Informe um e-mail válido.').should('be.visible')
  })

  it('envia pedido de reset e mostra código gerado', () => {
    cy.intercept('POST', '**/password-reset/request', {
      statusCode: 200,
      body: { reset_code: '123456' },
    }).as('requestReset')

    cy.get('input[placeholder="voce@exemplo.com"]')
      .clear()
      .type('user@example.com')
    cy.contains('Enviar link').click()
    cy.wait('@requestReset')

    cy.contains('Código para teste: 123456').should('be.visible')
    for (let i = 0; i < 6; i++) {
      cy.get(`#code-input-${i}`).should('exist')
    }
  })

  it('valida código incompleto', () => {
    cy.intercept('POST', '**/password-reset/request', {
      statusCode: 200,
      body: { reset_code: null },
    }).as('requestReset2')

    cy.get('input[placeholder="voce@exemplo.com"]')
      .clear()
      .type('user@example.com')
    cy.contains('Enviar link').click()
    cy.wait('@requestReset2')

    cy.contains('Enviar').click()
    cy.contains('Informe o código completo de 6 dígitos.').should('be.visible')
  })

  it('valida mensagens de erro na etapa de nova senha', () => {
    cy.intercept('POST', '**/password-reset/request', {
      statusCode: 200,
      body: { reset_code: '123456' },
    }).as('requestReset3')

    cy.get('input[placeholder="voce@exemplo.com"]')
      .clear()
      .type('user@example.com')
    cy.contains('Enviar link').click()
    cy.wait('@requestReset3')

    for (let i = 0; i < 6; i++) cy.get(`#code-input-${i}`).type('1')
    cy.contains('Enviar').click()

    cy.contains('Salvar senha').click()
    cy.contains('Preencha os dois campos de senha.').should('be.visible')

    cy.get('input[type="password"]').first().type('12345678')
    cy.get('input[type="password"]').eq(1).type('87654321')
    cy.contains('Salvar senha').click()
    cy.contains('As senhas devem ser iguais.').should('be.visible')

    cy.get('input[type="password"]').first().clear().type('123')
    cy.get('input[type="password"]').eq(1).clear().type('123')
    cy.contains('Salvar senha').click()
    cy.contains('A senha deve ter pelo menos 8 caracteres.').should(
      'be.visible'
    )
  })

  it('trata erro do backend ao confirmar nova senha e volta para código', () => {
    cy.intercept('POST', '**/password-reset/request', {
      statusCode: 200,
      body: { reset_code: '123456' },
    }).as('requestReset4')

    cy.intercept('POST', '**/password-reset/confirm', {
      statusCode: 400,
      body: { detail: 'Invalid or expired reset code' },
    }).as('confirmReset')

    cy.get('input[placeholder="voce@exemplo.com"]')
      .clear()
      .type('user@example.com')
    cy.contains('Enviar link').click()
    cy.wait('@requestReset4')

    for (let i = 0; i < 6; i++) cy.get(`#code-input-${i}`).type('1')
    cy.contains('Enviar').click()

    cy.get('input[type="password"]').first().type('senhavalida123')
    cy.get('input[type="password"]').eq(1).type('senhavalida123')
    cy.contains('Salvar senha').click()

    cy.wait('@confirmReset', { timeout: 10000 })

    cy.contains('Código inválido ou expirado.').should('be.visible')
  })
})
