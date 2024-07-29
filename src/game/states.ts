import { type Game } from "./Game";
import { type ParsedPlayerCommand } from "./ParsedPlayerCommand";
import { Scene } from "./Scene";

export abstract class GameState {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  startGame(): void {
    throw new Error("Method not implemented.");
  }

  stopGame(): void {
    this.game.changeState(new ReadyState(this.game));
  }

  transitionScene(_nextScene: Scene): void {
    throw new Error("Method not implemented.");
  }

  processInput(_playerInput: string): ParsedPlayerCommand | void {
    throw new Error("Method not implemented.");
  }

  processTakeCommand(): void {
    throw new Error("Method not implemented.");
  }

  endGame(): void {
    throw new Error("Method not implemented.");
  }
}

export class EndSceneState extends GameState {
  override transitionScene(nextScene: Scene): void {
    this.game.currentScene = nextScene;
    this.game.narrativeOutputAdapter(
      [
        `*** ${this.game.currentScene.name} ***`,
        "",
        this.game.currentScene.description,
        "",
      ],
      false
    );
    if (!this.game.currentScene.isTerminal) {
      this.game.playerPromptAdapter(this.game.currentScene.prompt);
      this.game.changeState(new AwaitingInputState(this.game));
    } else {
      this.game.playerPromptAdapter("Game Over");
      this.game.changeState(new GameOverState(this.game));
    }
  }
}

export class GameOverState extends GameState {
  override endGame(): void {
    // TODO: disable UI input
    // TOOD: player / story / score to AWS Dynamo DB
  }
}

export class ReadyState extends GameState {
  override startGame(): void {
    this.game.currentScene = this.game.scenes[0];
    this.game.narrativeOutputAdapter(
      [
        `*** ${this.game.currentScene.name} ***`,
        "",
        this.game.currentScene.description,
        "",
      ],
      true
    );
    this.game.playerPromptAdapter(this.game.currentScene.prompt);
    this.game.changeState(new AwaitingInputState(this.game));
  }
}

export class AwaitingInputState extends GameState {
  override processInput(playerInput: string): ParsedPlayerCommand {
    const playerCommand = this.game.playerInputParser.parse(playerInput);
    this.game.processPlayerCommand(playerCommand);
    return playerCommand;
  }
}
