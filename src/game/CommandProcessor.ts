export type PlayerInputParser = (rawInput: string) => IParsedPlayerCommand;

export interface IParsedPlayerCommand {
  status: PlayerCommandStatus;
  name: PlayerCommand;
  target: string;
  message: string;
}

export enum PlayerCommandStatus {
  INVALID = "invalid",
  VALID = "valid",
}

export enum PlayerCommand {
  EXAMINE = "examine",
  GO = "go",
  HELP = "help",
  INVALID = "",
  INVENTORY = "inventory",
  LOOK = "look",
  SCORE = "score",
  TAKE = "take",
}

export class CommandProcessor {
  private static commandPatternMap = new Map<
    PlayerCommand,
    { pattern: RegExp; help: string }
  >([
    [
      PlayerCommand.EXAMINE,
      {
        pattern: /^\s*examine\s+([a-z0-9'"]+|([a-z0-9'"]+ [a-z0-9'"]+)+)\s*$/i,
        help: "examine <item> - Use to examine things in a scene",
      },
    ],
    [
      PlayerCommand.GO,
      {
        pattern: /^\s*go\s+([a-z0-9'"]+)\s*$/i,
        help: "go <direction> - Use to move through scenes",
      },
    ],
    [
      PlayerCommand.HELP,
      {
        pattern: /^\s*help\s*(\s*[a-z0-9'"]+)?\s*$/i,
        help: "help [command] - displays help for a specific command or all commands",
      },
    ],
    [
      PlayerCommand.INVENTORY,
      {
        pattern: /^\s*inventory\s*$/i,
        help: "inventory - Show the items you've collected",
      },
    ],
    [
      PlayerCommand.LOOK,
      { pattern: /^\s*look\s*$/i, help: "look - Describes the current scene" },
    ],
    [
      PlayerCommand.SCORE,
      {
        pattern: /^\s*score\s*$/i,
        help: "score - Displays your current score",
      },
    ],
    [
      PlayerCommand.TAKE,
      {
        pattern: /^\s*take\s+([a-z0-9'"]+|([a-z0-9'"]+ [a-z0-9'"]+)+)\s*$/i,
        help: "take <item> - Take an item into inventory",
      },
    ],
  ]);

  private helpText: string[];

  constructor() {
    this.helpText = [];
    CommandProcessor.commandPatternMap.forEach(({ help }) => {
      this.helpText.push(help);
    });

    this.helpText.sort();
  }

  getCommandHelp(command = ""): string[] {
    const key =
      PlayerCommand[command.toUpperCase() as keyof typeof PlayerCommand];
    const specificHelp = CommandProcessor.commandPatternMap.get(key)?.help;

    const helpOutput = specificHelp
      ? [specificHelp]
      : ["***", "Valid commands are as follows:", ...this.helpText];

    return helpOutput;
  }

  parse(input: string): IParsedPlayerCommand {
    let matched: IParsedPlayerCommand = {
      status: PlayerCommandStatus.INVALID,
      name: PlayerCommand.INVALID,
      target: "",
      message: "",
    };

    CommandProcessor.commandPatternMap.forEach(({ pattern }, name) => {
      const match = pattern.exec(input);
      if (Array.isArray(match)) {
        const target = match[1] ? match[1] : "";
        matched = {
          status: PlayerCommandStatus.VALID,
          name,
          target: target.trim(),
          message: "",
        };
      }
    });

    return matched;
  }
}
