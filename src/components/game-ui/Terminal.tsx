import { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  ScrollView,
  Text,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import { type Game } from "../../game/Game";
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
    return <Text key={crypto.randomUUID()}>&nbsp;</Text>;
  });

type TerminalProps = {
  game: Game;
};

export default function Terminal({ game }: TerminalProps) {
  const { tokens } = useTheme();
  const [inputDisabled, setInputDisabled] = useState(true);
  const [narrativeOutput, setNarrativeOutput] = useState<JSX.Element[]>([]);
  const [feedbackOutput, setFeedbackOutput] = useState<JSX.Element[]>([]);
  const [playerPrompt, setPlayerPrompt] = useState("");
  const [power, setPower] = useState(false);
  const [playerInput, setPlayerInput] = useState("");
  const [inputFeedback, setInputFeedback] = useState("");

  /**
   * An OutputAdapater is responsible for recieving the output generated by the
   * Game engine and manipulating it so that it is properly renderable in the
   * Terminal, optionally clearing any previously received output.
   */
  function getOutputAdapter(
    stateSetter: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    fullscreenClear: boolean
  ) {
    return (output: string[], clear: boolean = false) => {
      const renderableOutput = [
        ...output.map((str) => (
          <Text key={crypto.randomUUID()}>{str ? str : <>&nbsp;</>}</Text>
        )),
      ];
      const emptyLines = fullscreenClear ? EMPTY_TERMINAL_LINES : [];
      clear
        ? stateSetter([...emptyLines, ...renderableOutput])
        : stateSetter((prev) => [
            ...prev,
            <hr key={crypto.randomUUID()} />,
            <br key={crypto.randomUUID()} />,
            ...renderableOutput,
          ]);
    };
  }

  useEffect(() => {
    game.setFeedbackOutput = getOutputAdapter(setFeedbackOutput, false);
  }, []);

  useEffect(() => {
    game.setNarrativeOutput = getOutputAdapter(setNarrativeOutput, true);
  }, []);

  /**
   * An explicit adapter for the player prompt is not needed since the prompt
   * text generated by the game engine is just used as the child value of the
   * last Text line in the Terminal output and doesn't need to be transformed or
   * wrapped by a JSX element.
   */
  game.setPlayerPrompt = setPlayerPrompt;

  const terminalWindowRef = useRef<HTMLDivElement>(null);
  const playerPromptRef = useRef<HTMLParagraphElement>(null);
  const playerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (playerPromptRef) {
      playerPromptRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [narrativeOutput, feedbackOutput]);

  const clearTerminal = () => {
    setNarrativeOutput(() => []);
    setFeedbackOutput([]);
    setPlayerPrompt("");
    setInputFeedback("");
    setPlayerInput("");
  };

  const powerHandler = () => {
    const isPoweredOn = !power;
    setPower(isPoweredOn);
    if (isPoweredOn) {
      terminalWindowRef.current?.scrollTo(0, 0);
      game.powerOn();
      setInputDisabled(false);
      setInputFeedback("Try typing: help");
      setTimeout(() => {
        playerInputRef.current?.focus();
      }, 0);
    } else {
      clearTerminal();
      game.powerOff();
      setInputDisabled(true);
    }
  };

  return (
    <View
      fontFamily="monospace"
      fontSize={tokens.fontSizes.small}
      width={`${TERMINAL_WIDTH}ch`}
    >
      <Flex direction="column" gap="0" minHeight="100%">
        <ScrollView
          ref={terminalWindowRef}
          aria-readonly={true}
          style={{ overflowY: "hidden" }}
          border={`${TERMINAL_BORDER_WIDTH}ch ridge silver`}
          padding={`${TERMINAL_PADDING_WIDTH}ch`}
          height={`${TERMINAL_HEIGHT}lh`}
          minHeight={`${TERMINAL_HEIGHT}lh`}
        >
          {narrativeOutput && narrativeOutput.map((line) => line)}
          {feedbackOutput && feedbackOutput.map((line) => line)}
          {playerPrompt && <Text ref={playerPromptRef}>{playerPrompt}</Text>}
        </ScrollView>
        <TerminalInput
          inputRef={playerInputRef}
          game={game}
          playerInputProcessor={game.processInput.bind(game)}
          disabled={inputDisabled}
          setDisabled={setInputDisabled}
          setInputFeedback={setInputFeedback}
          playerInput={playerInput}
          setPlayerInput={setPlayerInput}
        />
        <Text minHeight="1lh">{inputFeedback}</Text>
        <Flex justifyContent="end">
          <Button
            alignSelf={"flex-end"}
            borderColor="#f0f0f0"
            onClick={powerHandler}
            marginBlockStart={tokens.fontSizes.large}
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
                game.powerOn();
                setInputDisabled(false);
                setInputFeedback("Try typing: help");
              }, 0);
              playerInputRef.current?.focus();
            }}
            marginBlockStart={tokens.fontSizes.large}
          >
            <GrPowerReset style={{ color: "#f0f0f0" }} />
            &nbsp;RESET
          </Button>
        </Flex>
      </Flex>
    </View>
  );
}
