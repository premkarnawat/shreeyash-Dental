import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(15,23,42,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#f1f5f9',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '50px',
            padding: '12px 20px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#020617' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#020617' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
