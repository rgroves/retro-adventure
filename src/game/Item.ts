export class Item {
  public id: string;
  public name: string;
  public qty: number;

  constructor({
    id,
    name,
    qty = 1,
  }: Omit<Item, "qty"> & Partial<Pick<Item, "qty">>) {
    if (typeof id !== "string" || !id) {
      throw Error(
        `Invalid id in scene properties ${JSON.stringify(arguments[0])}`
      );
    }

    if (typeof name !== "string" || !name) {
      throw Error(
        `Invalid name in item properties ${JSON.stringify(arguments[0])}`
      );
    }

    if (typeof qty !== "number" || qty < 1) {
      throw Error(
        `Invalid qty in item properties ${JSON.stringify(arguments[0])}`
      );
    }

    this.id = crypto.randomUUID();
    this.name = name;
    this.qty = qty;
  }
}
