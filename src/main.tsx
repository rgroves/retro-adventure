import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Authenticator } from '@aws-amplify/ui-react'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Authenticator initialState='signIn'>
        {({ signOut, user }) => {
          return (
            <Authenticator.Provider>
              <App signOut={signOut} user={user} />
            </Authenticator.Provider>
          )
        }}
      </Authenticator>
    </React.StrictMode>,
  )
}
