import Exit, { ExitDirection } from "./Exit";
import { Item } from "./Item";
import { ParsedPlayerCommand } from "./ParsedPlayerCommand";
import {
  PlayerCommand,
  PlayerCommandStatus,
  PlayerInputParser,
} from "./PlayerInputParser";
import { Scene } from "./Scene";
import { EndSceneState, type GameState, ReadyState } from "./states";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

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
      exits: new Map(),
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
    // console.log(`State has changed to ${state.constructor.name}`);
  }

  initialize() {
    this.score = 0;
    this.inventory = new Map();
    this._scenes = this.loadScenes();
  }

  async saveScore() {
    const userId = localStorage.getItem("userSub");
    const username = localStorage.getItem("preferred_username");
    await client.models.HighScore.create({
      userId: userId,
      preferredUsername: username,
      score: this.score,
      stats: "{}",
    });
  }

  start() {
    this.state = new ReadyState(this);
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

  getHelp() {
    return [
      "Valid commands are as follows:",
      "examine - Use to examine things in a scene",
      "go <direction> - Use to move through scenes",
      "help - You're looking at it",
      "inventory - Show the items you've collected",
      "look - Describes the current scene",
      "score - Displays your current score",
      "take <item> - Take an item into inventory",
    ];
  }

  processPlayerCommand(playerCommand: ParsedPlayerCommand) {
    if (playerCommand.status === PlayerCommandStatus.VALID) {
      switch (playerCommand.name) {
        case PlayerCommand.EXAMINE: {
          const item =
            this.currentScene.items.get(playerCommand.target) ||
            this.inventory.get(playerCommand.target);
          if (item && item.isExaminable) {
            playerCommand.message = item.examineMessage;
            this.score += item.examinePointValue;
            this.feedbackOutputAdapter([playerCommand.message, ""], true);
          } else {
            playerCommand.status = PlayerCommandStatus.INVALID;
            playerCommand.message = "You can't do that.";
            this.feedbackOutputAdapter([playerCommand.message, ""], true);
          }
          break;
        }

        case PlayerCommand.GO: {
          const exit = this.currentScene.exits.get(
            ExitDirection[
              playerCommand.target.toUpperCase() as keyof typeof ExitDirection
            ]
          );
          if (exit) {
            const nextScene = this.scenes.find(
              (scene) => scene.id === exit.sceneId
            );
            if (!nextScene) {
              throw new Error(`Could not find Scene with id ${exit.sceneId}`);
            }
            this.feedbackOutputAdapter([playerCommand.message, ""], true);
            this.state = new EndSceneState(this);
            this.state.transitionScene(nextScene);
          } else {
            playerCommand.status = PlayerCommandStatus.INVALID;
            playerCommand.message = "You can't do that.";
            this.feedbackOutputAdapter([playerCommand.message, ""], true);
          }
          break;
        }

        case PlayerCommand.HELP: {
          this.feedbackOutputAdapter([...this.getHelp(), ""], true);
          break;
        }

        case PlayerCommand.INVENTORY: {
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
        }

        case PlayerCommand.LOOK: {
          this.narrativeOutputAdapter(
            [this.currentScene.description, ""],
            true
          );
          this.feedbackOutputAdapter([playerCommand.message, ""], true);
          break;
        }

        case PlayerCommand.SCORE: {
          this.feedbackOutputAdapter([`Score: ${this.score}`, ""], true);
          break;
        }

        case PlayerCommand.TAKE: {
          const item = this.currentScene.items.get(playerCommand.target);
          if (item && item.isTakeable) {
            this.currentScene.items.delete(playerCommand.target);
            this.inventory.set(item.name.toLowerCase(), item);
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
        }

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
          name: "Stranger in a Strange Land",
          description:
            "You find yourself standing in the middle of a strange room. A portal, glowing neon green, can be seen to the east. Another portal, glowing neon red, can be seen to the west. There is a strange looking gun on the ground neear your feet.",
          exits: new Map([
            [
              ExitDirection.EAST,
              new Exit({
                direction: ExitDirection.EAST,
                sceneId: "586fcbcd-694b-437f-8cd9-5a8a11f54793",
              }),
            ],
            [
              ExitDirection.WEST,
              new Exit({
                direction: ExitDirection.WEST,
                sceneId: "f5e683b7-bf4a-47b3-b4ff-00e5339d590d",
              }),
            ],
          ]),
          items: new Map([
            [
              "gun",
              new Item({
                id: crypto.randomUUID(),
                name: "Ray Gun",
                sceneDescFragment:
                  " There is a strange looking gun on the ground neear your feet.",
                isTakeable: true,
                takenPointValue: 25,
                isExaminable: true,
                takenMessage: "You take the gun.",
                examinePointValue: 5,
                examineMessage: "It seems to be a 1950's retro-style ray gun.",
              }),
            ],
          ]),
        }),
        new Scene({
          id: "586fcbcd-694b-437f-8cd9-5a8a11f54793",
          name: "Green Means Go",
          description:
            "As you step into the green portal, you're skin begins to tingle and then there is a brilliant flash of light.",
          exits: new Map(),
          items: new Map(),
        }),
        new Scene({
          id: "f5e683b7-bf4a-47b3-b4ff-00e5339d590d",
          name: "Red Means Dead",
          description:
            "You immediately realize this was a huge mistake. As your skin begins to peel and your muscle and bone tear apart, your final thought is that, luckily, this will be the last mistake you'll ever make.",
          prompt: "Game Over",
          exits: new Map(),
          items: new Map(),
        }),
      ]
    );

    return scenes;
  }
}
