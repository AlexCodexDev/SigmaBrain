import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')!).render(
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={3000}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
  >
    <React.StrictMode>
      <BrowserRouter basename='/'>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
  </SnackbarProvider>
)
