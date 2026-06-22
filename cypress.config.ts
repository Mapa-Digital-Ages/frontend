import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      EMAIL_LOGIN_ALUNO: process.env.VITE_EMAIL_LOGIN_ALUNO,
      PASSWORD_LOGIN_ALUNO: process.env.VITE_PASSWORD_LOGIN_ALUNO,
      EMAIL_LOGIN_RESPONSAVEL: process.env.VITE_EMAIL_LOGIN_RESPONSAVEL,
      PASSWORD_LOGIN_RESPONSAVEL: process.env.VITE_PASSWORD_LOGIN_RESPONSAVEL,
      EMAIL_LOGIN_ADMIN: process.env.VITE_EMAIL_LOGIN_ADMIN,
      PASSWORD_LOGIN_ADMIN: process.env.VITE_PASSWORD_LOGIN_ADMIN,
      EMAIL_LOGIN_EMPRESA: process.env.VITE_EMAIL_LOGIN_EMPRESA,
      PASSWORD_LOGIN_EMPRESA: process.env.VITE_PASSWORD_LOGIN_EMPRESA,
      EMAIL_LOGIN_ESCOLA: process.env.VITE_EMAIL_LOGIN_ESCOLA,
      PASSWORD_LOGIN_ESCOLA: process.env.VITE_PASSWORD_LOGIN_ESCOLA,
      EMAIL_LOGIN_ESCOLA_EMPRESA: process.env.VITE_EMAIL_LOGIN_ESCOLA_EMPRESA,
      PASSWORD_LOGIN_ESCOLA_EMPRESA:
        process.env.VITE_PASSWORD_LOGIN_ESCOLA_EMPRESA,
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
