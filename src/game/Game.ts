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

export class Game {
  public currentScene: Scene;
  public inventory: Map<string, Item>;
  public score: number;
  public storyTitle: string;

  get commandProcessor() {
    return this._commandProcessor;
  }

  get narrativeOutput() {
    return this._narrativeOutput;
  }

  get feedbackOutput() {
    return this._feedbackOutput;
  }

  get playerPrompt() {
    return this._playerPrompt;
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

  get isGameOver() {
    return this._isGameOver;
  }

  set gameOver(value: boolean) {
    this._isGameOver = value;
  }

  private _commandProcessor: CommandProcessor;
  private _scenes: Scene[];
  private _state: GameState | null;
  private _narrativeOutput: string[];
  private _feedbackOutput: string[];
  private _playerPrompt: string;
  private _isGameOver: boolean;
  private _gameUpdateSubscribers: ((tick: number) => void)[];

  constructor() {
    this.currentScene = new Scene({
      id: "-1",
      name: "NullScene",
      description: "ERROR",
      exits: new Map(),
      items: new Map(),
    });
    this._gameUpdateSubscribers = [];
    this.changeState(new PoweredOnState(this));
    this._commandProcessor = new CommandProcessor();
    this._scenes = [];
    this._state = null;
    this.inventory = new Map();
    this.score = 0;
    this.storyTitle = "";
    this._narrativeOutput = [];
    this._feedbackOutput = [];
    this._playerPrompt = "";
    this._isGameOver = true;
  }

  changeState(state: GameState) {
    this._state = state;
    this.update();
    // console.log(`State has changed to ${state.constructor.name}`);
  }

  initialize() {
    this.score = 0;
    this.inventory = new Map();
    this._scenes = this.loadScenes();
    this._narrativeOutput = [];
    this._feedbackOutput = [];
    this._playerPrompt = "";
    this._isGameOver = false;
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

  reset() {
    console.log("TODO: Implement game reset");
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

  setNarrativeOutput(output: string[], clear = false) {
    if (clear) {
      this._narrativeOutput = [];
    }
    this._narrativeOutput.push(...output);
  }

  setFeedbackOutput(output: string[], clear = false) {
    if (clear) {
      this._feedbackOutput = [];
    }
    this._feedbackOutput.push(...output);
  }

  setPlayerPrompt(prompt: string) {
    this._playerPrompt = prompt;
  }

  subscribeToGameUpdates(subscriber: (tick: number) => void) {
    this._gameUpdateSubscribers.push(subscriber);
  }

  update() {
    const tick = Date.now();
    this._gameUpdateSubscribers.forEach((subscriber) => {
      subscriber(tick);
    });
  }

  private loadScenes(): Scene[] {
    // TODO: load story and scenes from external source
    this.storyTitle = storyTitle;
    const scenes: Scene[] = loadCorgiQuest();
    return scenes;
  }
}
