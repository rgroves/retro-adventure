import { type Game } from "./Game";
import { type ParsedPlayerCommand } from "./ParsedPlayerCommand";

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

export class ReadyState extends GameState {
  override startGame(): void {
    this.game.currentScene = this.game.scenes[0];
    this.game.narrativeOutputAdapter(
      [this.game.currentScene.description, ""],
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
