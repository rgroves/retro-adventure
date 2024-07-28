import { ParsedPlayerCommand, PlayerCommand } from "./types";

const commandPatternMap = new Map<PlayerCommand, RegExp>([
  ["take", /^take\s+(\w+|(\w+ \w+)+)\s*$/i],
]);

export class PlayerInputParser {
  public validate: (input: string) => ParsedPlayerCommand;

  constructor() {
    this.validate = (input: string) => {
      let matched: ParsedPlayerCommand = {
        status: "invalid",
        name: "",
        item: "",
      };

      commandPatternMap.forEach((pattern, name) => {
        const match = pattern.exec(input);
        if (Array.isArray(match)) {
          console.log(`matched ${name}: using ${match[1]}`);
          matched = { status: "valid", name, item: match[1] };
        }
      });

      return matched;
    };
  }
}
