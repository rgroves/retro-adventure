import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "./App.css";
import BaseLayout from "./components/BaseLayout";
import Terminal from "./components/game-ui/Terminal";
import { Game } from "./game/Game";

Amplify.configure(outputs);
const game = new Game();

function App() {
  return (
    <BaseLayout>
      <Terminal game={game} />
    </BaseLayout>
  );
}

export default App;
