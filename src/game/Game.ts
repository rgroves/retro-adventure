import { Item } from "./Item";
import { PlayerInputParser } from "./PlayerInputParser";
import { Scene } from "./Scene";

type SetOutputAdapter = (output: string[], clear: boolean) => void;
type SetPlayerPrompt = React.Dispatch<React.SetStateAction<string>>;

export class Game {
  private commandProcessor: PlayerInputParser;
  private outputAdapter: ((output: string[], clear: boolean) => void) | null;
  private playerPromptAdapter: ((prompt: string) => void) | null;
  private scenes: Scene[];

  constructor() {
    this.commandProcessor = new PlayerInputParser();
    this.outputAdapter = null;
    this.playerPromptAdapter = null;
    this.scenes = this.loadScenes();
  }

  setPlayerPromptAdapter(callback: SetPlayerPrompt) {
    this.playerPromptAdapter = callback;
  }

  setOutputAdapter(callback: SetOutputAdapter) {
    this.outputAdapter = callback;
  }

  start() {
    if (this.outputAdapter) {
      this.outputAdapter([this.scenes[0].description, ""], true);
    }

    if (this.playerPromptAdapter) {
      this.playerPromptAdapter("What do you do?");
    }
  }

  processInput(rawInput: string) {
    return this.commandProcessor.validate(rawInput);
  }

  loadScenes(): Scene[] {
    const scenes: Scene[] = [];
    // TODO: load real scenes from external source
    scenes.push(
      ...[
        new Scene({
          id: "36489ebf-498d-4cf5-8b17-33e1a568c1d2",
          name: "Scene 1 Placeholder",
          description: "This is a scene description. There is a widget here.",
          items: [new Item({ id: crypto.randomUUID(), name: "widget" })],
        }),
      ]
    );

    return scenes;
  }
}
