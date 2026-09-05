import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './contexts/CartContext'
import { CompareProvider } from './contexts/CompareContext'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { DeliveryProvider } from './contexts/DeliveryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <DeliveryProvider>
          <AuthProvider>
            <CartProvider>
              <CompareProvider>
                <App />
              </CompareProvider>
            </CartProvider>
          </AuthProvider>
        </DeliveryProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
