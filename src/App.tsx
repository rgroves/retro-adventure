import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react'
import { useState } from 'react'
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

Amplify.configure(outputs)

function App() {
  const [count, setCount] = useState(0)

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div>
            <h1>Hello {user?.username}</h1>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => { setCount((count) => count + 1) }}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </Authenticator>
  )
}

export default App
