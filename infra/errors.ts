class BaseError extends Error {
  action: string;
  constructor({ action, message, name }: ErrorParams) {
    super(message);
    this.action = action;
    this.name = name;
  }

  toJSON() {
    return { message: this.message, action: this.action, name: this.name };
  }
}

export class InvalidInputError extends BaseError {
  constructor({
    action = 'Revise os dados enviados.',
    message = 'Valores inválidos.',
  }: ChildeErrorParams = {}) {
    super({ action, message, name: 'InvalidInputError' });
  }
}

type ErrorParams = {
  message: string;
  action: string;
  name: string;
};

type ChildeErrorParams = Partial<Omit<ErrorParams, 'name'>>;
