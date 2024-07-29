import { Item } from "./Item";
import { ParsedPlayerCommand } from "./ParsedPlayerCommand";
import { PlayerCommandStatus, PlayerInputParser } from "./PlayerInputParser";
import { Scene } from "./Scene";
import { type GameState, ReadyState } from "./states";

type OutputAdapter = (output: string[], clear?: boolean) => void;
type PlayerPromptAdapter = React.Dispatch<React.SetStateAction<string>>;

export class Game {
  public currentScene: Scene;
  public state: GameState;

  get playerInputParser() {
    return this._playerInputParser;
  }

  get outputAdapter(): OutputAdapter {
    if (!this._outputAdapter) {
      throw new Error("The Game.outputAdapter is not initialized!");
    }
    return this._outputAdapter;
  }

  set outputAdapter(callback: OutputAdapter) {
    this._outputAdapter = callback;
  }

  get playerPromptAdapter() {
    if (!this._playerPromptAdapter) {
      throw new Error("The Game.playerPromptAdapter is not initialized!");
    }
    return this._playerPromptAdapter;
  }

  set playerPromptAdapter(callback: PlayerPromptAdapter) {
    this._playerPromptAdapter = callback;
  }

  get scenes() {
    return this._scenes;
  }

  private _outputAdapter: OutputAdapter | null;
  private _playerInputParser: PlayerInputParser;
  private _playerPromptAdapter: PlayerPromptAdapter | null;
  private _scenes: Scene[];

  constructor() {
    this.currentScene = new Scene({
      id: "-1",
      name: "NullScene",
      description: "ERROR",
      items: new Map(),
    });
    this._outputAdapter = null;
    this._playerPromptAdapter = null;
    this.state = new ReadyState(this);
    this._playerInputParser = new PlayerInputParser();
    this._scenes = this.loadScenes();
  }

  changeState(state: GameState) {
    this.state = state;
    console.log(`State has changed to ${state.constructor.name}`);
  }

  start() {
    this.state.startGame();
  }

  stop() {
    this.state.stopGame();
  }

  processInput(rawInput: string): ParsedPlayerCommand {
    const parsedCmd = this.state.processInput(rawInput);
    if (!parsedCmd) {
      // This shouldn't happen, but if you're debugging and here, Murphy says, "Hi!"
      throw Error("Something went wrong in command paring.");
    }
    return parsedCmd;
  }

  processPlayerCommand(playerCommand: ParsedPlayerCommand) {
    if (playerCommand.status === PlayerCommandStatus.VALID) {
      const item = this.currentScene.items.get(playerCommand.item);
      if (item && item.isTakeable) {
        this.currentScene.items.delete(playerCommand.item);
        playerCommand.message = item.takenMessage;
        this.outputAdapter([playerCommand.message, ""]);
      } else {
        playerCommand.status = PlayerCommandStatus.INVALID;
        playerCommand.message = "You can't do that.";
        this.outputAdapter([playerCommand.message, ""]);
      }
    }

    return playerCommand;
  }

  private loadScenes(): Scene[] {
    const scenes: Scene[] = [];
    // TODO: load real scenes from external source
    scenes.push(
      ...[
        new Scene({
          id: "36489ebf-498d-4cf5-8b17-33e1a568c1d2",
          name: "Scene 1 Placeholder",
          description: "This is a scene description. There is a widget here.",
          items: new Map([
            [
              "widget",
              new Item({
                id: crypto.randomUUID(),
                name: "widget",
                isTakeable: true,
                takenMessage: "You take the widget. It is very widget-y.",
              }),
            ],
          ]),
        }),
      ]
    );

    return scenes;
  }
}
