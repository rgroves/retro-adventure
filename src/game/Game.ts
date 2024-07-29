import { Item } from "./Item";
import { ParsedPlayerCommand } from "./ParsedPlayerCommand";
import {
  PlayerCommand,
  PlayerCommandStatus,
  PlayerInputParser,
} from "./PlayerInputParser";
import { Scene } from "./Scene";
import { type GameState, ReadyState } from "./states";

type OutputAdapter = (output: string[], clear?: boolean) => void;
type PlayerPromptAdapter = React.Dispatch<React.SetStateAction<string>>;

export class Game {
  public currentScene: Scene;
  public state: GameState;
  public inventory: Map<string, Item>;
  public score: number;

  get playerInputParser() {
    return this._playerInputParser;
  }

  get feedbackOutputAdapter(): OutputAdapter {
    if (!this._feedbackOutputAdapter) {
      throw new Error("The Game.feedbackOutputAdapter is not initialized!");
    }
    return this._feedbackOutputAdapter;
  }

  set feedbackOutputAdapter(callback: OutputAdapter) {
    this._feedbackOutputAdapter = callback;
  }

  get narrativeOutputAdapter(): OutputAdapter {
    if (!this._narrativeOutputAdapter) {
      throw new Error("The Game.narrativeOutputAdapter is not initialized!");
    }
    return this._narrativeOutputAdapter;
  }

  set narrativeOutputAdapter(callback: OutputAdapter) {
    this._narrativeOutputAdapter = callback;
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

  private _feedbackOutputAdapter: OutputAdapter | null;
  private _narrativeOutputAdapter: OutputAdapter | null;
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
    this._feedbackOutputAdapter = null;
    this._narrativeOutputAdapter = null;
    this._playerPromptAdapter = null;
    this.state = new ReadyState(this);
    this._playerInputParser = new PlayerInputParser();
    this._scenes = [];
    this.inventory = new Map();
    this.score = 0;
  }

  changeState(state: GameState) {
    this.state = state;
    console.log(`State has changed to ${state.constructor.name}`);
  }

  initialize() {
    this.score = 0;
    this.inventory = new Map();
    this._scenes = this.loadScenes();
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
      switch (playerCommand.name) {
        case PlayerCommand.INVENTORY:
          const inventoryOutput: string[] = [];
          if (this.inventory.size > 0) {
            inventoryOutput.push("The following items are in your inventory:");
            this.inventory.forEach((item) =>
              inventoryOutput.push(
                `${item.name} ${item.qty > 1 ? `(x${item.qty}` : ""}`
              )
            );
          } else {
            inventoryOutput.push("Your inventory is empty.");
          }
          this.feedbackOutputAdapter([...inventoryOutput, ""], true);
          break;

        case PlayerCommand.LOOK:
          this.narrativeOutputAdapter(
            [this.currentScene.description, ""],
            true
          );
          break;

        case PlayerCommand.SCORE:
          this.feedbackOutputAdapter([`Score: ${this.score}`, ""], true);
          break;

        case PlayerCommand.TAKE:
          const item = this.currentScene.items.get(playerCommand.item);
          if (item && item.isTakeable) {
            this.currentScene.items.delete(playerCommand.item);
            this.inventory.set(item.name, item);
            playerCommand.message = item.takenMessage;
            this.score += item.takenPointValue;
            this.feedbackOutputAdapter([playerCommand.message, ""], true);
            this.currentScene.description =
              this.currentScene.description.replace(item.sceneDescFragment, "");
          } else {
            playerCommand.status = PlayerCommandStatus.INVALID;
            playerCommand.message = "You can't do that.";
            this.feedbackOutputAdapter([playerCommand.message, ""], true);
          }
          break;

        default:
          throw new Error("Invalid command processing state encountered.");
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
                sceneDescFragment: " There is a widget here.",
                isTakeable: true,
                takenPointValue: 25,
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
