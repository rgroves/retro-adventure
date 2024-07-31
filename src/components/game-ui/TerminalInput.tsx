import { Input } from "@aws-amplify/ui-react";
import { PlayerCommandStatus } from "../../game/CommandProcessor";
import { PlayerInputParser } from "../../game/types";
import { Game } from "../../game/Game";
import { GameOverState } from "../../game/states";

type TerminalInputProps = {
  game: Game;
  playerInputProcessor: PlayerInputParser;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setInputFeedback: React.Dispatch<React.SetStateAction<string>>;
  playerInput: string;
  setPlayerInput: React.Dispatch<React.SetStateAction<string>>;
};

export default function TerminalInput({
  game,
  playerInputProcessor,
  disabled,
  setDisabled,
  setInputFeedback,
  playerInput,
  setPlayerInput,
}: TerminalInputProps) {
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    const command = playerInputProcessor(playerInput);

    if (command.status === PlayerCommandStatus.INVALID) {
      setInputFeedback("Invalid command");
    } else {
      setPlayerInput("");
      setInputFeedback("");
    }

    if (!(game.state instanceof GameOverState)) {
      setDisabled(false);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <Input
          disabled={disabled}
          type="text"
          onChange={(e) => {
            setPlayerInput(e.target.value);
          }}
          value={playerInput}
        />
      </form>
    </>
  );
}
