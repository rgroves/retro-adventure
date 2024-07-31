import Exit, { ExitDirection } from "./Exit";
import { Item } from "./Item";
import {
  PlayerCommand,
  PlayerCommandStatus,
  CommandProcessor,
  IParsedPlayerCommand,
} from "./CommandProcessor";
import { Scene } from "./Scene";
import {
  type GameState,
  PoweredOnState,
  ExamineState,
  GoState,
  HelpState,
  InventoryState,
  LookState,
  ScoreState,
  TakeState,
} from "./states";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

type OutputAdapter = (output: string[], clear?: boolean) => void;
type PlayerPromptAdapter = React.Dispatch<React.SetStateAction<string>>;

export class Game {
  public currentScene: Scene;
  public inventory: Map<string, Item>;
  public score: number;

  get commandProcessor() {
    return this._commandProcessor;
  }

  get setFeedbackOutput(): OutputAdapter {
    if (!this._setFeedbackOutput) {
      throw new Error("The feedback output adapter is not initialized!");
    }
    return this._setFeedbackOutput;
  }

  set setFeedbackOutput(callback: OutputAdapter) {
    this._setFeedbackOutput = callback;
  }

  get setNarrativeOutput(): OutputAdapter {
    if (!this._setNarrativeOutput) {
      throw new Error("The narrative output adapter is not initialized!");
    }
    return this._setNarrativeOutput;
  }

  set setNarrativeOutput(callback: OutputAdapter) {
    this._setNarrativeOutput = callback;
  }

  get setPlayerPrompt() {
    if (!this._setPlayerPrompt) {
      throw new Error("The player prompt adapter is not initialized!");
    }
    return this._setPlayerPrompt;
  }

  set setPlayerPrompt(callback: PlayerPromptAdapter) {
    this._setPlayerPrompt = callback;
  }

  get scenes() {
    return this._scenes;
  }

  get state() {
    if (!this._state) {
      throw new Error("Encountered uninitialized state!");
    }
    return this._state;
  }

  private _setFeedbackOutput: OutputAdapter | null;
  private _setNarrativeOutput: OutputAdapter | null;
  private _commandProcessor: CommandProcessor;
  private _setPlayerPrompt: PlayerPromptAdapter | null;
  private _scenes: Scene[];
  private _state: GameState | null;

  constructor() {
    this.currentScene = new Scene({
      id: "-1",
      name: "NullScene",
      description: "ERROR",
      exits: new Map(),
      items: new Map(),
    });
    this._setFeedbackOutput = null;
    this._setNarrativeOutput = null;
    this._setPlayerPrompt = null;
    this.changeState(new PoweredOnState(this));
    this._commandProcessor = new CommandProcessor();
    this._scenes = [];
    this._state = null;
    this.inventory = new Map();
    this.score = 0;
  }

  changeState(state: GameState) {
    this._state = state;
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
    if (userId && username) {
      let result = await client.models.GameScores.create(
        {
          userId: userId,
          preferredUsername: username,
          storyTitle: "Demo", // TODO: need to incorporate this into Game: Game.currentStoryTitle
          score: this.score,
          stats: "{}",
        },
        { authMode: "userPool" }
      );

      // TODO handle errors gracefully.
      if (result.errors) {
        console.log({ errors: result.errors });
      }
    }
  }

  powerOn() {
    this.changeState(new PoweredOnState(this));
    this.state.powerOn();
  }

  powerOff() {
    this.state.powerOff();
  }

  processInput(rawInput: string): IParsedPlayerCommand {
    const parsedCmd = this.state.processInput(rawInput.toLowerCase().trim());
    return parsedCmd;
  }

  processPlayerCommand(playerCommand: IParsedPlayerCommand) {
    if (playerCommand.status === PlayerCommandStatus.VALID) {
      switch (playerCommand.name) {
        case PlayerCommand.EXAMINE: {
          this.changeState(new ExamineState(this));
          this.state.processCommand(playerCommand);
          break;
        }

        case PlayerCommand.GO: {
          this.changeState(new GoState(this));
          this.state.processCommand(playerCommand);
          break;
        }

        case PlayerCommand.HELP: {
          this.changeState(new HelpState(this));
          this.state.processCommand(playerCommand);
          break;
        }

        case PlayerCommand.INVENTORY: {
          this.changeState(new InventoryState(this));
          this.state.processCommand(playerCommand);
          break;
        }

        case PlayerCommand.LOOK: {
          this.changeState(new LookState(this));
          this.state.processCommand(playerCommand);
          break;
        }

        case PlayerCommand.SCORE: {
          this.changeState(new ScoreState(this));
          this.state.processCommand(playerCommand);
          break;
        }

        case PlayerCommand.TAKE: {
          this.changeState(new TakeState(this));
          this.state.processCommand(playerCommand);
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
