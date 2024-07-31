import { ExitDirection } from "./Exit";
import { type Game } from "./Game";
import { IParsedPlayerCommand } from "./CommandProcessor";
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

  processCommand(_command: IParsedPlayerCommand): void {
    throw new Error("Method not implemented.");
  }

  processInput(_playerInput: string): IParsedPlayerCommand {
    throw new Error("Method not implemented.");
  }

  endGame(): void {
    throw new Error("Method not implemented.");
  }
}

export class StartSceneState extends GameState {
  override playScene(scene: Scene, shouldClearScreen: boolean = false): void {
    this.game.currentScene = scene;
    this.game.setNarrativeOutput(
      this.game.currentScene.getInitialSceneNarrative(),
      shouldClearScreen
    );

    if (this.game.currentScene.isTerminal) {
      this.game.changeState(new GameOverState(this.game));
      this.game.state.endGame();
    } else {
      this.game.setPlayerPrompt(this.game.currentScene.prompt);
      this.game.changeState(new AwaitingInputState(this.game));
    }
  }
}

export class GameOverState extends GameState {
  override endGame(): void {
    this.game.setFeedbackOutput([`Score: ${this.game.score}`]);
    this.game.setPlayerPrompt("Game Over");
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
  override processInput(playerInput: string): IParsedPlayerCommand {
    const playerCommand = this.game.commandProcessor.parse(playerInput);
    this.game.processPlayerCommand(playerCommand);
    return playerCommand;
  }
}

export class ExamineState extends GameState {
  override processCommand(command: IParsedPlayerCommand): void {
    const item =
      this.game.currentScene.items.get(command.target) ||
      this.game.inventory.get(command.target);

    if (item && item.isExaminable) {
      command.message = item.examineMessage;
      this.game.score += item.examinePointValue;
      this.game.setFeedbackOutput([command.message, ""], true);
    } else {
      this.game.setFeedbackOutput(["You can't do that.", ""], true);
    }

    this.game.changeState(new AwaitingInputState(this.game));
  }
}

export class GoState extends GameState {
  override processCommand(command: IParsedPlayerCommand): void {
    const direction =
      command.target.toUpperCase() as keyof typeof ExitDirection;

    const exit = this.game.currentScene.exits.get(ExitDirection[direction]);

    if (exit) {
      const nextScene = this.game.scenes.find(
        (scene) => scene.id === exit.sceneId
      );

      if (!nextScene) {
        throw new Error(`Could not find Scene with id ${exit.sceneId}`);
      }

      this.game.setFeedbackOutput([command.message, ""], true);
      this.game.changeState(new StartSceneState(this.game));
      this.game.state.playScene(nextScene);
    } else {
      this.game.setFeedbackOutput(["You can't go there.", ""], true);
      this.game.changeState(new AwaitingInputState(this.game));
    }
  }
}

export class HelpState extends GameState {
  override processCommand(command: IParsedPlayerCommand): void {
    const helpText = this.game.commandProcessor.getCommandHelp(command.target);
    this.game.setFeedbackOutput([...helpText, ""], true);
    this.game.changeState(new AwaitingInputState(this.game));
  }
}

export class InventoryState extends GameState {
  override processCommand(_command: IParsedPlayerCommand): void {
    const inventoryOutput: string[] = [];

    if (this.game.inventory.size > 0) {
      inventoryOutput.push("The following items are in your inventory:");
      this.game.inventory.forEach((item) =>
        inventoryOutput.push(
          `${item.name} ${item.qty > 1 ? `(x${item.qty}` : ""}`
        )
      );
    } else {
      inventoryOutput.push("Your inventory is empty.");
    }

    this.game.setFeedbackOutput([...inventoryOutput, ""], true);
    this.game.changeState(new AwaitingInputState(this.game));
  }
}

export class LookState extends GameState {
  override processCommand(_command: IParsedPlayerCommand): void {
    this.game.setNarrativeOutput(
      [this.game.currentScene.description, ""],
      false
    );
    this.game.setFeedbackOutput([], true);
    this.game.changeState(new AwaitingInputState(this.game));
  }
}

export class ScoreState extends GameState {
  override processCommand(_command: IParsedPlayerCommand): void {
    this.game.setFeedbackOutput([`Score: ${this.game.score}`, ""], true);
    this.game.changeState(new AwaitingInputState(this.game));
  }
}

export class TakeState extends GameState {
  override processCommand(command: IParsedPlayerCommand): void {
    const item = this.game.currentScene.items.get(command.target);

    if (item && item.isTakeable) {
      this.game.currentScene.items.delete(command.target);
      this.game.inventory.set(item.name.toLowerCase(), item);
      this.game.score += item.takenPointValue;
      this.game.setFeedbackOutput([item.takenMessage, ""], true);
      this.game.currentScene.description =
        this.game.currentScene.description.replace(item.sceneDescFragment, "");
    } else {
      this.game.setFeedbackOutput(["You can't do that.", ""], true);
    }

    this.game.changeState(new AwaitingInputState(this.game));
  }
}
