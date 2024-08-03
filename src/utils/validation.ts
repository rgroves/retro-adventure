type TypeName = "boolean" | "number" | "string";
type AnyRule =
  | Rule<string>
  | Rule<number>
  | Rule<boolean>
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | Rule<Map<any, any>>;

export enum ValidationType {
  BOOLEAN = 1,
  NUMBER = 2,
  STRING = 3,
}

const expectedTypeMap = new Map<ValidationType, TypeName>([
  [ValidationType.BOOLEAN, "boolean"],
  [ValidationType.NUMBER, "number"],
  [ValidationType.STRING, "string"],
]);

export class Rule<T> {
  private propertyNames: string[];
  private expectedType: TypeName | undefined;
  private allowedValues: Set<T> | undefined;
  private disallowedValues: Set<T> | undefined;
  private lessThanValue: number | undefined;
  private greaterThanValue: number | undefined;
  private ruleDescription: string;
  private optional: boolean;
  private expectedInstanceType: unknown;

  constructor() {
    this.propertyNames = [];
    this.ruleDescription = "";
    this.optional = false;
  }

  forProperties(propertyNames: string[]) {
    this.propertyNames.push(...propertyNames);
    return this;
  }

  forProperty(propertyName: string) {
    this.propertyNames.push(propertyName);
    return this;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  isInstanceOf(expectedInstanceType: any) {
    this.expectedInstanceType = expectedInstanceType;
    return this;
  }

  hasType(validationType: ValidationType) {
    const typeName = expectedTypeMap.get(validationType);

    if (!typeName) {
      throw new Error(
        `Invalid expectedType value must be a valid ValidationType: ${validationType.toString()}`
      );
    }

    this.expectedType = typeName;
    return this;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  allowed(values: Set<any>) {
    this.allowedValues = values;
    return this;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  disallowed(values: Set<any>) {
    this.disallowedValues = values;
    return this;
  }

  greaterThan(value: number) {
    this.greaterThanValue = value;
    return this;
  }

  lessThan(value: number) {
    this.lessThanValue = value;
    return this;
  }

  description(description: string) {
    this.ruleDescription = description;
    return this;
  }

  isOptional() {
    this.optional = true;
    return this;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  check(obj: Record<string, any>, errors: string[]): string[] {
    for (const propertyName of this.propertyNames) {
      if (Object.hasOwn(obj, propertyName)) {
        const data = obj[propertyName] as T;
        const isValid =
          (this.expectedType ? typeof data === this.expectedType : true) &&
          (this.allowedValues ? this.allowedValues.has(data) : true) &&
          (this.disallowedValues ? !this.disallowedValues.has(data) : true) &&
          (typeof data === "number" && this.lessThanValue
            ? data < this.lessThanValue
            : true) &&
          (typeof data === "number" && this.greaterThanValue
            ? data > this.greaterThanValue
            : true) &&
          (this.expectedInstanceType
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data instanceof (this.expectedInstanceType as any)
            : true);

        if (!isValid) {
          errors.push(`${propertyName} ${this.ruleDescription}`);
        }
      } else if (!this.optional) {
        errors.push(`Missing property ${propertyName}`);
      }
    }

    return errors;
  }
}

export class ObjectValidator {
  private tag: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private data: Record<string, any>;
  private rules: AnyRule[];
  private errors: string[];

  constructor() {
    this.tag = "";
    this.data = {};
    this.rules = [];
    this.errors = [];
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  isFor(name: string, data?: Record<string, any>) {
    this.tag = name;
    if (data) {
      this.data = data;
    }
    return this;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  usingData(data: Record<string, any>) {
    this.data = data;
    return this;
  }

  addRule(rule: AnyRule) {
    this.rules.push(rule);
    return this;
  }

  _validate(rule: AnyRule): string[] {
    const errors: string[] = [];

    return rule.check(this.data, errors);
  }

  validate(): void {
    this.errors = [];
    this.rules.forEach((rule) => {
      this.errors.push(...this._validate(rule));
    });

    if (this.errors.length > 0) {
      throw new Error(
        `Validation failed for ${this.tag}: ${this.errors.join(", ")}`
      );
    }
  }
}
