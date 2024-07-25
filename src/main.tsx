import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import { theme } from './components/RetroTheme.tsx'
import '@aws-amplify/ui-react/styles.css';

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Authenticator initialState='signIn'>
        {() => {
          return (
            <Authenticator.Provider>
              <ThemeProvider theme={theme} colorMode='system'>
                <App />
              </ThemeProvider>
            </Authenticator.Provider>
          )
        }}
      </Authenticator>
    </React.StrictMode>,
  )
}
