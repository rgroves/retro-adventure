import { Amplify } from 'aws-amplify';
import { WithAuthenticatorProps } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';
import './App.css'
import UserMenu from './components/UserMenu';

Amplify.configure(outputs);

function App({ signOut, user }: WithAuthenticatorProps) {
  return <UserMenu signOut={signOut} user={user} />;
}

export default App
