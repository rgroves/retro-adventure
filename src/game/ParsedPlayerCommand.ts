export class ParsedPlayerCommand {
  public status: string;
  public name: string;
  public target: string;
  public message: string;

  constructor({ status, name, target, message }: ParsedPlayerCommand) {
    this.status = status;
    this.name = name;
    this.target = target;
    this.message = message;
  }
}
