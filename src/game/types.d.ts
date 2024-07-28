type PlayerCommand = "take";

export type PlayerCommandStatus = "invalid" | "valid";

export type ParsedPlayerCommand = {
  status: PlayerCommandStatus;
  name: string;
  item: string;
};

export type PlayerInputProcessor = (rawInput: string) => ParsedPlayerCommand;
