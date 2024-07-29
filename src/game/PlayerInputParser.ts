import { ParsedPlayerCommand } from "./ParsedPlayerCommand";

export enum PlayerCommandStatus {
  INVALID = "invalid",
  VALID = "valid",
}

export enum PlayerCommand {
  TAKE = "take",
  INVENTORY = "inventory",
}

export class PlayerInputParser {
  private static _commandPatternMap = new Map<PlayerCommand, RegExp>([
    [PlayerCommand.TAKE, /^\s*take\s+(\w+|(\w+ \w+)+)\s*$/i],
    [PlayerCommand.INVENTORY, /^\s*inventory\s*$/i],
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
        matched = { status: "valid", name, item: match[1], message: "" };
      }
    });

    return matched;
  }
}
