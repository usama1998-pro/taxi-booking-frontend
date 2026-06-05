import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PaymentProviders } from '@/components/PaymentProviders'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaymentProviders>
      <App />
    </PaymentProviders>
  </StrictMode>,
)
