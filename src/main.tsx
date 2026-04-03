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
        components: {
          Button: {
            defaultBg: "#014F43",
            defaultColor: "#ffffff",

            defaultHoverBg: "#014F43",
            defaultHoverColor: "#ffffff",

            defaultActiveBg: "#014F43",
            defaultActiveColor: "#ffffff",

            defaultBorderColor: "transparent",

            // optional: remove shadows/focus ring
            boxShadow: "none",
            controlOutline: "none",
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
)
