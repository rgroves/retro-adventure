export class Item {
  public id: string;
  public name: string;
  public sceneDescFragment: string;
  public isTakeable: boolean;
  public takenPointValue: number;
  public takenMessage: string;
  public isExaminable: boolean;
  public examinePointValue: number;
  public examineMessage: string;
  public qty: number;

  constructor({
    id,
    name,
    sceneDescFragment = "",
    isTakeable = false,
    takenPointValue = 0,
    takenMessage = "",
    isExaminable = false,
    examinePointValue = 0,
    examineMessage = "",
    qty = 1,
  }: Pick<Item, "id" | "name"> & Partial<Item>) {
    // TODO replace these validaion checks with a schema validator.
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

    if (typeof sceneDescFragment !== "string" || !name) {
      throw Error(
        `Invalid sceneDescFragment in item properties ${JSON.stringify(
          arguments[0]
        )}`
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

    if (typeof examineMessage !== "string") {
      throw Error(
        `Invalid examineMessage in item properties ${JSON.stringify(
          arguments[0]
        )}`
      );
    }

    if (typeof examinePointValue !== "number") {
      throw Error(
        `Invalid examinePointValue in item properties ${JSON.stringify(
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
    this.sceneDescFragment = sceneDescFragment;
    this.isTakeable = isTakeable;
    this.takenPointValue = takenPointValue;
    this.takenMessage = takenMessage;
    this.isExaminable = isExaminable;
    this.examinePointValue = examinePointValue;
    this.examineMessage = examineMessage;
    this.qty = qty;
  }
}
