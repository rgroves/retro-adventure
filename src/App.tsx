import { Amplify, ResourcesConfig } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "./App.css";
import Terminal from "./components/game-ui/Terminal";
import { Game } from "./game/Game";
import { PlayerCommandStatus } from "./game/CommandProcessor";

Amplify.configure(outputs as ResourcesConfig);

const game = new Game();

function App() {
  const playerInputHandler = (input: string) => {
    const command = game.processInput(input);
    return command.status === PlayerCommandStatus.VALID;
  };

  const powerStateChangeHandler = (power: boolean) => {
    if (power) {
      game.powerOn();
    } else {
      game.powerOff();
    }
  };

  const getNarrative = () => {
    return game.narrativeOutput;
  };

  const getFeedback = () => {
    return game.feedbackOutput;
  };

  const getPlayerPrompt = () => {
    return game.playerPrompt;
  };

  const getGameOverFlag = () => {
    return game.isGameOver;
  };

  const addGameUpdateSubscriber = (subscriber: (tick: number) => void) => {
    game.subscribeToGameUpdates(subscriber);
  };

  return (
    <Terminal
      addGameUpdateSubscriber={addGameUpdateSubscriber}
      onInputSubmitted={playerInputHandler}
      onPowerStateChange={powerStateChangeHandler}
      getGameNarrative={getNarrative}
      getGameFeedback={getFeedback}
      getPlayerPrompt={getPlayerPrompt}
      getGameOverFlag={getGameOverFlag}
    />
  );
}

export default App;
