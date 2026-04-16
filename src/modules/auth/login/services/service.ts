import { authService } from '@/app/auth/core/service'

export const loginService = {
  register: authService.register,
  getRole: authService.getRole,
}
