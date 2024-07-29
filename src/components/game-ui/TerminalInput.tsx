import { Input } from "@aws-amplify/ui-react";
import { PlayerCommandStatus } from "../../game/PlayerInputParser";
import { PlayerInputParser } from "../../game/types";

type CommandLineProps = {
  playerInputProcessor: PlayerInputParser;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setInputFeedback: React.Dispatch<React.SetStateAction<string>>;
  playerInput: string;
  setPlayerInput: React.Dispatch<React.SetStateAction<string>>;
};

export default function TerminalInput({
  playerInputProcessor,
  disabled,
  setDisabled,
  setInputFeedback,
  playerInput,
  setPlayerInput,
}: CommandLineProps) {
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    const command = playerInputProcessor(playerInput);

    if (command.status === PlayerCommandStatus.INVALID) {
      setInputFeedback("Invalid command");
    } else {
      // TODO remove this log msg
      console.log(`Valid ${command.name} of [${command.item}]`);
      setPlayerInput("");
    }

    setDisabled(false);
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
