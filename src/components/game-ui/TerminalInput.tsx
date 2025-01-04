import { useRef, useState } from "react";
import { Input } from "@aws-amplify/ui-react";

interface TerminalInputProps {
  disabled: boolean;
  onInputSubmitted: (playerInput: string) => boolean;
  shouldClearInput: boolean;
  shouldFocusInput: boolean;
}

export default function TerminalInput({
  disabled,
  onInputSubmitted,
  shouldClearInput,
  shouldFocusInput,
}: TerminalInputProps) {
  const playerInputRef = useRef<HTMLInputElement>(null);
  const [playerInput, setPlayerInput] = useState("");

  if (shouldFocusInput) {
    playerInputRef.current?.focus();
  }

  if (shouldClearInput && playerInput != "") {
    setPlayerInput("");
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (playerInput.trim() !== "") {
      const isCommandValid = onInputSubmitted(playerInput);

      if (isCommandValid) {
        setPlayerInput("");
      }
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Input
        ref={playerInputRef}
        disabled={disabled}
        type="text"
        onChange={(e) => {
          setPlayerInput(e.target.value);
        }}
        value={playerInput}
      />
    </form>
  );
}
