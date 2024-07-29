import { Item } from "./Item";

const DEFAULT_PROMPT = "What do you do?";

export class Scene {
  public id: string;
  public name: string;
  public description: string;
  public prompt: string;
  public items: Map<string, Item>;

  constructor({
    id,
    name,
    description,
    prompt = DEFAULT_PROMPT,
    items,
  }: Omit<Scene, "prompt"> & Partial<Scene>) {
    if (typeof id !== "string" || !id) {
      throw Error(
        `Invalid id in scene properties ${JSON.stringify(arguments[0])}`
      );
    }

    if (typeof name !== "string" || !name) {
      throw Error(
        `Invalid name in scene properties ${JSON.stringify(arguments[0])}`
      );
    }

    if (typeof description !== "string" || !description) {
      throw Error(
        `Invalid description in scene properties ${JSON.stringify(
          arguments[0]
        )}`
      );
    }

    if (typeof prompt !== "string" || !prompt) {
      throw Error(
        `Invalid prompt in scene properties ${JSON.stringify(arguments[0])}`
      );
    }

    if (!(items instanceof Map)) {
      throw Error(
        `Invalid items in scene properties ${JSON.stringify(arguments[0])}`
      );
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.prompt = prompt || "What do you do?";
    this.items = items;
  }
}
