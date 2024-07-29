import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "./App.css";
import BaseLayout from "./components/BaseLayout";
import Terminal from "./components/game-ui/Terminal";
import { Game } from "./game/Game";
import { useRef } from "react";

Amplify.configure(outputs);
const game = new Game();

function App() {
  const gameRef = useRef(game);

  return (
    <BaseLayout>
      <Terminal game={gameRef.current} />
    </BaseLayout>
  );
}

export default App;
