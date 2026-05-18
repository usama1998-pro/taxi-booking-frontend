import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DisplayCurrencyProvider } from '@/context/DisplayCurrencyContext'
import { PaymentProviders } from '@/components/PaymentProviders'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DisplayCurrencyProvider>
      <PaymentProviders>
        <App />
      </PaymentProviders>
    </DisplayCurrencyProvider>
  </StrictMode>,
)
