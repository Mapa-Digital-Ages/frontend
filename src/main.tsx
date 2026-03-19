import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { STORAGE_KEYS } from '@/constants/storage'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

const persistedMode = localStorage.getItem(STORAGE_KEYS.themeMode)
if (persistedMode === 'dark' || persistedMode === 'light') {
  document.documentElement.dataset.theme = persistedMode
  document.documentElement.classList.toggle('dark', persistedMode === 'dark')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
