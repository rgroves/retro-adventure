import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';
import './App.css'

Amplify.configure(outputs)

function App() {

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div>
            <h1>Hello {user?.username}</h1>
          </div>
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </Authenticator>
  )
}

export default App
