export class Item {
  public id: string;
  public name: string;
  public isTakeable: boolean;
  public takenPointValue: number;
  public takenMessage: string;
  public qty: number;

  constructor({
    id,
    name,
    isTakeable = false,
    takenPointValue = 0,
    takenMessage = "",
    qty = 1,
  }: Omit<Item, "qty"> & Partial<Item>) {
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

    if (typeof takenMessage !== "string") {
      throw Error(
        `Invalid takenMessage in item properties ${JSON.stringify(
          arguments[0]
        )}`
      );
    }

    if (typeof takenPointValue !== "number") {
      throw Error(
        `Invalid takenPointValue in item properties ${JSON.stringify(
          arguments[0]
        )}`
      );
    }

    if (typeof qty !== "number" || qty < 1) {
      throw Error(
        `Invalid qty in item properties ${JSON.stringify(arguments[0])}`
      );
    }

    this.id = crypto.randomUUID();
    this.name = name;
    this.isTakeable = isTakeable;
    this.takenPointValue = takenPointValue;
    this.takenMessage = takenMessage;
    this.qty = qty;
  }
}
