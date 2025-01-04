import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  ScrollView,
  Text,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import TerminalInput from "./TerminalInput";
import { GrPower, GrPowerReset } from "react-icons/gr";

const TERMINAL_PADDING_WIDTH = 2;
const TERMINAL_BORDER_WIDTH = 1;
const TERMINAL_WIDTH =
  80 + TERMINAL_PADDING_WIDTH * 2 + TERMINAL_BORDER_WIDTH * 2;
const TERMINAL_HEIGHT = 20;
const EMPTY_TERMINAL_LINES = Array(TERMINAL_HEIGHT)
  .fill(undefined)
  .map(() => {
    const key = crypto.randomUUID();
    return <Text key={key}>&nbsp;</Text>;
  });

interface TerminalProps {
  addGameUpdateSubscriber: (subscriber: (tick: number) => void) => void;
  onInputSubmitted: (input: string) => boolean;
  onPowerStateChange: (power: boolean) => void;
  getGameNarrative: () => string[];
  getGameFeedback: () => string[];
  getPlayerPrompt: () => string;
  getGameOverFlag: () => boolean;
}

export default function Terminal({
  addGameUpdateSubscriber,
  onInputSubmitted,
  onPowerStateChange,
  getGameNarrative,
  getGameFeedback,
  getPlayerPrompt,
  getGameOverFlag,
}: TerminalProps) {
  console.log("in Terminal");
  const { tokens } = useTheme();
  const [, setGameUpdateTick] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [shouldClearInput, setShouldClearInput] = useState(false);
  const [narrativeOutput, setNarrativeOutput] = useState<JSX.Element[]>([]);
  const [feedbackOutput, setFeedbackOutput] = useState<JSX.Element[]>([]);
  const [playerPromptOutput, setPlayerPromptOutput] = useState("");
  const [power, setPower] = useState(false);
  const [inputFeedback, setInputFeedback] = useState("");

  const narrative = getGameNarrative();
  const feedback = getGameFeedback();
  const playerPrompt = getPlayerPrompt();
  const isGameOver = getGameOverFlag();

  const gameUpdateSubscriber = useCallback(
    (tick: number) => {
      setGameUpdateTick(tick);
    },
    [setGameUpdateTick]
  );

  addGameUpdateSubscriber(gameUpdateSubscriber);

  const isNarrativeStart = narrative.length === 0;

  useEffect(() => {
    const wrappedNarrative = [
      ...EMPTY_TERMINAL_LINES,
      ...narrative.map((str) => (
        <Text key={crypto.randomUUID()}>{str ? str : <>&nbsp;</>}</Text>
      )),
    ];

    const wrappedFeedback = [
      ...feedback.map((str) => (
        <Text key={crypto.randomUUID()}>{str ? str : <>&nbsp;</>}</Text>
      )),
    ];

    setNarrativeOutput(wrappedNarrative);
    setFeedbackOutput(wrappedFeedback);
    setPlayerPromptOutput(playerPrompt);
    setInputDisabled(isGameOver);
  }, [isGameOver, narrative, feedback, playerPrompt, isNarrativeStart]);

  const playerPromptRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    playerPromptRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [narrativeOutput, feedbackOutput]);

  const clearTerminal = () => {
    setNarrativeOutput(() => []);
    setFeedbackOutput([]);
    setPlayerPromptOutput("");
    setInputFeedback("");
    setShouldClearInput(true);
  };

  const powerHandler = () => {
    const isPoweredOn = !power;
    setPower(isPoweredOn);
    if (isPoweredOn) {
      onPowerStateChange(true);
      setInputDisabled(false);
      setInputFeedback("Try typing: help");
      setShouldFocusInput(true);
    } else {
      clearTerminal();
      onPowerStateChange(false);
      setShouldFocusInput(false);
      setInputDisabled(true);
    }
  };

  const inputSubmittedHandler = (playerInput: string) => {
    const isCommandValid = onInputSubmitted(playerInput);

    if (isCommandValid) {
      setInputFeedback("");
    } else {
      setInputFeedback("Invalid command");
    }

    return isCommandValid;
  };

  return (
    <View
      fontFamily="monospace"
      fontSize={tokens.fontSizes.small}
      width={`${TERMINAL_WIDTH.toString()}ch`}
    >
      <Flex
        direction="column"
        justifyContent="flex-start"
        minHeight="100%"
        gap="0"
      >
        <ScrollView
          aria-readonly={true}
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            pointerEvents: "none",
            userSelect: "none",
          }}
          border={`${TERMINAL_BORDER_WIDTH.toString()}ch ridge silver`}
          padding={`${TERMINAL_PADDING_WIDTH.toString()}ch`}
          height={`${TERMINAL_HEIGHT.toString()}lh`}
          minHeight={`${TERMINAL_HEIGHT.toString()}lh`}
        >
          {narrativeOutput}
          {feedbackOutput}
          <Text ref={playerPromptRef}>{playerPromptOutput}</Text>
        </ScrollView>
        <TerminalInput
          disabled={inputDisabled}
          onInputSubmitted={inputSubmittedHandler}
          shouldClearInput={shouldClearInput}
          shouldFocusInput={shouldFocusInput}
        />
        <Text minHeight="1lh">{inputFeedback}</Text>
        <Flex
          paddingBlockStart={tokens.space.medium}
          paddingBlockEnd={tokens.space.medium}
          justifyContent="end"
        >
          <Button
            alignSelf={"flex-end"}
            borderColor="#f0f0f0"
            onClick={powerHandler}
          >
            <GrPower style={{ color: power ? "#0f0" : "#f00" }} />
            &nbsp;POWER
          </Button>
          <Button
            alignSelf={"flex-end"}
            borderColor="#f0f0f0"
            disabled={!power}
            onClick={() => {
              clearTerminal();
              setTimeout(() => {
                onPowerStateChange(true);
                setInputDisabled(false);
                setInputFeedback("Try typing: help");
              }, 0);
              setShouldFocusInput(true);
            }}
          >
            <GrPowerReset style={{ color: "#f0f0f0" }} />
            &nbsp;RESET
          </Button>
        </Flex>
      </Flex>
    </View>
  );
}
