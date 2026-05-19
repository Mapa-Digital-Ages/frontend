import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') })

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      EMAIL_LOGIN_ALUNO: process.env.VITE_EMAIL_LOGIN_ALUNO,
      PASSWORD_ALUNO: process.env.VITE_PASSWORD_LOGIN_ALUNO,
      //  | 'responsavel'
      //  | 'admin'
      //  | 'empresa'
      //  | 'escola'
      //  | 'escola_empresa'
    },
    setupNodeEvents(on, config) {
      console.log('--- DEBUG VARIÁVEIS CYPRESS ---')
      console.log(
        'E-mail do Aluno carregado:',
        process.env.VITE_EMAIL_LOGIN_ALUNO
      )
      console.log(
        'Senha do Aluno carregada:',
        process.env.VITE_PASSWORD_LOGIN_ALUNO ? '****' : 'UNDEFINED'
      )
      console.log('--------------------------------')
      return config
    },
  },
})
