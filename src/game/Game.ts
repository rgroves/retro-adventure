import { type Item } from "./Item";
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
import loadCorgiQuest, { storyTitle } from "./stories/corgi-quest";

const client = generateClient<Schema>();

type OutputAdapter = (output: string[], clear?: boolean) => void;
type PlayerPromptAdapter = React.Dispatch<React.SetStateAction<string>>;

export class Game {
  public currentScene: Scene;
  public inventory: Map<string, Item>;
  public score: number;
  public storyTitle: string;

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
    this.storyTitle = "";
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
    // TODO the game engine shouldn't be digging into localstorage
    const userId = localStorage.getItem("userSub");
    const username = localStorage.getItem("preferred_username");

    if (userId && username) {
      const gameScore = {
        userId: userId,
        preferredUsername: username,
        storyTitle: this.storyTitle,
        score: this.score,
        stats: "{}",
      };

      const { errors } = await client.models.GameScores.create(gameScore, {
        authMode: "userPool",
      });

      // TODO handle errors gracefully.
      if (errors) {
        console.log({ errors });
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
      switch (playerCommand.name as PlayerCommand) {
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
    // TODO: load story and scenes from external source
    this.storyTitle = storyTitle;
    const scenes: Scene[] = loadCorgiQuest();
    return scenes;
  }
}
