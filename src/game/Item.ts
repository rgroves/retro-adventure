import { ObjectValidator, Rule, ValidationType } from "../utils/validation";

interface IItem {
  id: string;
  name: string;
  sceneDescFragment: string;
  isTakeable: boolean;
  takenPointValue: number;
  takenMessage: string;
  isExaminable: boolean;
  examinePointValue: number;
  examineMessage: string;
  qty: number;
}

const itemValidator = new ObjectValidator()
  .isFor("ItemConfig")
  .addRule(
    new Rule<string>()
      .forProperties(["id", "name", "sceneDescFragment"])
      .hasType(ValidationType.STRING)
      .disallowed(new Set([""]))
      .description("must be a non-empty string")
  )
  .addRule(
    new Rule<string>()
      .forProperties(["examineMessage", "takenMessage"])
      .hasType(ValidationType.STRING)
      .description("must be a string")
  )
  .addRule(
    new Rule<number>()
      .forProperties(["examinePointValue", "takenPointValue"])
      .hasType(ValidationType.NUMBER)
      .description("must be a number")
  )
  .addRule(
    new Rule<number>()
      .forProperties(["qty"])
      .hasType(ValidationType.NUMBER)
      .greaterThan(0)
      .isOptional()
      .description("must be a number greater than 0")
  );

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

  constructor(itemConfig: Pick<IItem, "id" | "name"> & Partial<IItem>) {
    itemValidator.usingData(itemConfig).validate();

    const {
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
    } = itemConfig;

    this.id = id;
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
