import { expect, test } from '@playwright/test'

test('login screen validates credentials before submitting', async ({
  page,
}) => {
  await page.goto('/login')

  await expect(page.getByText('Entre no Mapa Digital')).toBeVisible()

  await page.getByPlaceholder('voce@exemplo.com').fill('invalid-email')
  await page.getByPlaceholder('digite sua senha').fill('123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()
  await expect(
    page.getByText('A senha deve ter pelo menos 8 caracteres.')
  ).toBeVisible()
})

test('register mode validates password confirmation', async ({ page }) => {
  await page.goto('/login')

  await page.getByRole('tab', { name: 'Cadastro' }).click()
  await expect(page.getByText('Cadastre-se no Mapa Digital')).toBeVisible()

  await page.getByPlaceholder('Ex.: Lucas Silva').fill('Maria Responsável')
  await page.getByPlaceholder('voce@exemplo.com').fill('maria@example.com')
  await page.getByPlaceholder('digite sua senha').fill('12345678')
  await page.getByPlaceholder('confirme sua senha').fill('87654321')
  await page.getByRole('button', { name: 'Criar conta' }).click()

  await expect(page.getByText('As senhas devem ser iguais.')).toBeVisible()
})
