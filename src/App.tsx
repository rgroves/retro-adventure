import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "./App.css";
import Terminal from "./components/game-ui/Terminal";
import { Game } from "./game/Game";
import { useRef } from "react";

Amplify.configure(outputs);
const game = new Game();

function App() {
  const gameRef = useRef(game);
  return <Terminal game={gameRef.current} />;
}

export default App;
