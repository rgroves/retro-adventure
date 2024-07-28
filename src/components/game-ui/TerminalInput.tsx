import { useState } from "react";
import { Input, Text } from "@aws-amplify/ui-react";
import { PlayerInputProcessor } from "../../game/types";

type CommandLineProps = {
  playerInputProcessor: PlayerInputProcessor;
};

export default function TerminalInput({
  playerInputProcessor,
}: CommandLineProps) {
  const [playerInput, setPlayerInput] = useState("");
  const [inputFeedback, setInputFeedback] = useState("");

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = playerInputProcessor(playerInput);

    if (command.status === "invalid") {
      setInputFeedback(`Invalid command`);
    } else {
      setInputFeedback(`Valid ${command.name} of [${command.item}]`);
      setPlayerInput("");
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <Input
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
