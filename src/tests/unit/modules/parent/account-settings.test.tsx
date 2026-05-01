import { expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountSettings from '@/modules/parent/settings/components/AccountSettings'
import type { ParentAccountSettings } from '@/modules/parent/settings/services/service'
import { renderWithProviders } from '@/tests/helpers/render'
import assert from 'assert'

const DEFAULT_VALUES = {
  email: 'parent@example.com',
  name: 'Maria Silva',
  phone: '',
}

test('AccountSettings renders form fields with initial values', () => {
  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  expect(screen.getByDisplayValue('Maria Silva')).toBeInTheDocument()
  expect(screen.getByDisplayValue('parent@example.com')).toBeInTheDocument()
})

test('AccountSettings save button is disabled when form has no changes', () => {
  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  expect(
    screen.getByRole('button', { name: /salvar alterações/i })
  ).toBeDisabled()
})

test('AccountSettings save button enables after editing a field', async () => {
  const user = userEvent.setup()

  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  const nameInput = screen.getByDisplayValue('Maria Silva')
  await user.clear(nameInput)
  await user.type(nameInput, 'Novo Nome')

  expect(
    screen.getByRole('button', { name: /salvar alterações/i })
  ).toBeEnabled()
})

test('AccountSettings calls onSave with trimmed values when form is valid', async () => {
  const user = userEvent.setup()
  const onSave = jest
    .fn<(s: ParentAccountSettings) => Promise<void>>()
    .mockResolvedValue(undefined)

  renderWithProviders(
    <AccountSettings initialValues={DEFAULT_VALUES} onSave={onSave} />
  )

  const nameInput = screen.getByDisplayValue('Maria Silva')
  await user.clear(nameInput)
  await user.type(nameInput, '  Ana Costa  ')
  await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Ana Costa' })
  )
})

test('AccountSettings disables save when name is cleared', async () => {
  const user = userEvent.setup()

  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  await user.clear(screen.getByDisplayValue('Maria Silva'))

  expect(
    screen.getByRole('button', { name: /salvar alterações/i })
  ).toBeDisabled()
  expect(screen.getByText(/informe seu nome completo/i)).toBeInTheDocument()
})

test('AccountSettings disables save when email is invalid', async () => {
  const user = userEvent.setup()

  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  const emailInput = screen.getByDisplayValue('parent@example.com')
  await user.clear(emailInput)
  await user.type(emailInput, 'not-an-email')

  expect(
    screen.getByRole('button', { name: /salvar alterações/i })
  ).toBeDisabled()
  expect(screen.getByText(/informe um e-mail válido/i)).toBeInTheDocument()
})

test('AccountSettings opens disable confirmation modal', async () => {
  const user = userEvent.setup()

  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  await user.click(screen.getByRole('button', { name: /desativar conta/i }))

  expect(screen.getByText('Desativar conta?')).toBeInTheDocument()
})

test('AccountSettings calls onDisableAccount after confirming disable', async () => {
  const user = userEvent.setup()
  const onDisableAccount = jest
    .fn<() => Promise<void>>()
    .mockResolvedValue(undefined)

  renderWithProviders(
    <AccountSettings
      initialValues={DEFAULT_VALUES}
      onDisableAccount={onDisableAccount}
    />
  )

  await user.click(screen.getByRole('button', { name: /desativar conta/i }))
  await user.click(screen.getByRole('button', { name: /^desativar$/i }))

  expect(onDisableAccount).toHaveBeenCalledTimes(1)
})

test('AccountSettings opens delete confirmation modal', async () => {
  const user = userEvent.setup()

  renderWithProviders(<AccountSettings initialValues={DEFAULT_VALUES} />)

  await user.click(screen.getByRole('button', { name: /excluir conta/i }))

  expect(screen.getByText('Excluir conta?')).toBeInTheDocument()
})

test('AccountSettings calls onDeleteAccount after confirming delete', async () => {
  const user = userEvent.setup()
  const onDeleteAccount = jest
    .fn<() => Promise<void>>()
    .mockResolvedValue(undefined)

  renderWithProviders(
    <AccountSettings
      initialValues={DEFAULT_VALUES}
      onDeleteAccount={onDeleteAccount}
    />
  )

  await user.click(screen.getByRole('button', { name: /excluir conta/i }))
  await user.click(screen.getByRole('button', { name: /^excluir$/i }))

  expect(onDeleteAccount).toHaveBeenCalledTimes(1)
})
