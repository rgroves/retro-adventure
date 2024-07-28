import { Item } from "./Item";

export class Scene {
  public id: string;
  public name: string;
  public description: string;
  public items: Item[];

  constructor({ id, name, description, items }: Scene) {
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

    if (!Array.isArray(items)) {
      throw Error(
        `Invalid items in scene properties ${JSON.stringify(arguments[0])}`
      );
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.items = items;
  }
}
