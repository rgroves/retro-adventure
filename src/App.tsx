import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import './App.css'
import BaseLayout from './components/BaseLayout';
import { Text } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

function App() {
  return (
    <BaseLayout>
      <Text>main placeholder</Text>
    </BaseLayout>
  );
}

export default App
