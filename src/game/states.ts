import { type Game } from "./Game";
import { type ParsedPlayerCommand } from "./ParsedPlayerCommand";
import { Scene } from "./Scene";

/**
 * Guide to the game's State Machine States:
 *
 * - PoweredOnState
 *   - This is the "entry point" state
 *   - It initializes the internal game state
 *   - Transitions state to StartSceneState and transitions to the first scene.
 *
 * - StartSceneState
 *   - Responsible for playing out a scene.
 *   - It sends the scene's description to the narrative output.
 *   - If the scene has no exits (isTerminal) it will transition to the
 *     GameOverState and end the game.
 *   - Otherwise it sends the scene's default prompt to the prompt output and
 *     transitions to the AwaitingInputState
 *
 * - AwaitingInputState
 *   - Responsible for processing player input once received
 *   - This state's processInput method is triggered by the Game engine's
 *     processInput method, which should be wired up to the UI in order to
 *     receive input from a player.
 *   - The input is parsed and is deemed either invalid or valid
 *   - State transitions are further handled by the Game engine's
 *     processPlayerCommand method
 *
 * - GameOverState
 *   - Responsible for hanlding the end of the game
 *   - Outputs the player's final score and a game over message
 *   - Persists the player's score to the DB
 */

export abstract class GameState {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  powerOn(): void {
    throw new Error("Method not implemented.");
  }

  powerOff(): void {
    this.game.changeState(new PoweredOnState(this.game));
  }

  playScene(_nextScene: Scene, _shouldClearScreen: boolean = false): void {
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

export class StartSceneState extends GameState {
  override playScene(scene: Scene, shouldClearScreen: boolean = false): void {
    this.game.currentScene = scene;
    this.game.narrativeOutputAdapter(
      [
        `*** ${this.game.currentScene.name} ***`,
        "",
        this.game.currentScene.description,
        "",
      ],
      shouldClearScreen
    );

    if (this.game.currentScene.isTerminal) {
      this.game.changeState(new GameOverState(this.game));
      this.game.state.endGame();
    } else {
      this.game.playerPromptAdapter(this.game.currentScene.prompt);
      this.game.changeState(new AwaitingInputState(this.game));
    }
  }
}

export class GameOverState extends GameState {
  override endGame(): void {
    this.game.feedbackOutputAdapter([`Score: ${this.game.score}`]);
    this.game.playerPromptAdapter("Game Over");
    this.game.saveScore();
  }
}

export class PoweredOnState extends GameState {
  override powerOn(): void {
    this.game.initialize();
    this.game.changeState(new StartSceneState(this.game));
    this.game.state.playScene(this.game.scenes[0], true);
  }
}

export class AwaitingInputState extends GameState {
  override processInput(playerInput: string): ParsedPlayerCommand {
    const playerCommand = this.game.playerInputParser.parse(playerInput);
    this.game.processPlayerCommand(playerCommand);
    return playerCommand;
  }
}
