import { httpClient } from '@/shared/lib/http/client'

type PasswordResetRequestResponse = {
  detail: string
  reset_code?: string | null
}

type PasswordResetRequestResult = {
  resetCode: string | null
}

type PasswordResetConfirmInput = {
  email: string
  code: string
  newPassword: string
}

export const forgotPasswordService = {
  async requestReset(email: string): Promise<PasswordResetRequestResult> {
    const response = await httpClient.post<PasswordResetRequestResponse>(
      'password-reset/request',
      { email },
      { skipAuth: true }
    )

    return {
      resetCode: response.data.reset_code ?? null,
    }
  },

  async confirmReset({
    email,
    code,
    newPassword,
  }: PasswordResetConfirmInput): Promise<void> {
    await httpClient.post(
      'password-reset/confirm',
      {
        email,
        code,
        new_password: newPassword,
      },
      { skipAuth: true }
    )
  },
}
