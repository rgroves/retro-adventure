export class ParsedPlayerCommand {
  public status: string;
  public name: string;
  public item: string;
  public message: string;

  constructor({ status, name, item, message }: ParsedPlayerCommand) {
    this.status = status;
    this.name = name;
    this.item = item;
    this.message = message;
  }
}
