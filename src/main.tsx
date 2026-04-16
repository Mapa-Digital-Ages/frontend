import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import './app/theme/styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

const persistedMode = localStorage.getItem(STORAGE_KEYS.themeMode)
const resolvedMode =
  persistedMode === 'dark' || persistedMode === 'light'
    ? persistedMode
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

if (resolvedMode === 'dark' || resolvedMode === 'light') {
  document.documentElement.dataset.theme = resolvedMode
  document.documentElement.classList.toggle('dark', resolvedMode === 'dark')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
