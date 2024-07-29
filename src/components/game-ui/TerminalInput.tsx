import { useState } from "react";
import { Input, Text } from "@aws-amplify/ui-react";
import { PlayerCommandStatus } from "../../game/PlayerInputParser";
import { PlayerInputParser } from "../../game/types";

type CommandLineProps = {
  playerInputProcessor: PlayerInputParser;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TerminalInput({
  playerInputProcessor,
  disabled,
  setDisabled,
}: CommandLineProps) {
  const [playerInput, setPlayerInput] = useState("");
  const [inputFeedback, setInputFeedback] = useState("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    const command = playerInputProcessor(playerInput);

    if (command.status === PlayerCommandStatus.INVALID) {
      setInputFeedback(`Invalid command`);
    } else {
      setInputFeedback(`Valid ${command.name} of [${command.item}]`);
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
      <Text minHeight="1lh" id="cmd-feedback">
        {inputFeedback}
      </Text>
    </>
  );
}
