import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DisplayCurrencyProvider } from '@/context/DisplayCurrencyContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DisplayCurrencyProvider>
      <App />
    </DisplayCurrencyProvider>
  </StrictMode>,
)
