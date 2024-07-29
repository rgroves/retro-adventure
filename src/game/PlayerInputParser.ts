import { ParsedPlayerCommand } from "./ParsedPlayerCommand";

export enum PlayerCommandStatus {
  INVALID = "invalid",
  VALID = "valid",
}

export enum PlayerCommand {
  EXAMINE = "examine",
  INVENTORY = "inventory",
  LOOK = "look",
  SCORE = "score",
  TAKE = "take",
}

export class PlayerInputParser {
  private static _commandPatternMap = new Map<PlayerCommand, RegExp>([
    [PlayerCommand.EXAMINE, /^\s*examine\s+(\w+|(\w+ \w+)+)\s*$/i],
    [PlayerCommand.INVENTORY, /^\s*inventory\s*$/i],
    [PlayerCommand.LOOK, /^\s*look\s*$/i],
    [PlayerCommand.SCORE, /^\s*score\s*$/i],
    [PlayerCommand.TAKE, /^\s*take\s+(\w+|(\w+ \w+)+)\s*$/i],
  ]);

  parse(input: string): ParsedPlayerCommand {
    let matched = new ParsedPlayerCommand({
      status: PlayerCommandStatus.INVALID,
      name: "",
      item: "",
      message: "",
    });

    PlayerInputParser._commandPatternMap.forEach((pattern, name) => {
      const match = pattern.exec(input);
      if (Array.isArray(match)) {
        console.log(`matched ${name}: using ${match[1]}`);
        matched = new ParsedPlayerCommand({
          status: PlayerCommandStatus.VALID,
          name,
          item: match[1],
          message: "",
        });
      }
    });

    return matched;
  }
}
