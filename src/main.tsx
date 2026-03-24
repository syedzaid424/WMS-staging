import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Poppins, sans-serif",           // making sure poppins as font family used.
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
)
