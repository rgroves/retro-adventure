import { ObjectValidator, Rule, ValidationType } from "../utils/validation";
import Exit, { ExitDirection } from "./Exit";
import { Item } from "./Item";

const DEFAULT_PROMPT = "What do you do?";

interface IScene {
  id: string;
  name: string;
  description: string;
  prompt: string;
  exits: Map<ExitDirection, Exit>;
  items: Map<string, Item>;
}

const sceneValidator = new ObjectValidator()
  .isFor("sceneConfig")
  .addRule(
    new Rule<string>()
      .forProperties(["id", "name", "description"])
      .hasType(ValidationType.STRING)
      .disallowed(new Set([""]))
      .description("must be a non-empty string")
  )
  .addRule(
    new Rule<string>()
      .forProperties(["prompt"])
      .hasType(ValidationType.STRING)
      .disallowed(new Set([""]))
      .isOptional()
      .description("must be a non-empty string")
  )
  .addRule(
    new Rule<Map<string, unknown>>()
      .forProperties(["exits", "items"])
      .isInstanceOf(Map)
      .description("must be a Map instance")
  );

export class Scene {
  public id: string;
  public name: string;
  public description: string;
  public prompt: string;
  public exits: Map<ExitDirection, Exit>;
  public items: Map<string, Item>;

  public get isTerminal(): boolean {
    return this.exits.size === 0;
  }

  constructor(sceneConfig: Omit<IScene, "prompt"> & Partial<IScene>) {
    const {
      id,
      name,
      description,
      prompt = DEFAULT_PROMPT,
      exits,
      items,
    } = sceneConfig;

    sceneValidator.usingData(sceneConfig).validate();

    this.id = id;
    this.name = name;
    this.description = description;
    this.prompt = prompt || "What do you do?";
    this.exits = exits;
    this.items = items;
  }

  getInitialSceneNarrative(): string[] {
    return [`*** ${this.name} ***`, "", this.description, ""];
  }

  getItem(name: string): Item | undefined {
    const item = this.items.get(name);
    return item;
  }
}
