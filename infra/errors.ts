export class BaseError extends Error {
  action: string;
  constructor({ action, message, name, cause }: ErrorParams) {
    super(message);
    this.action = action;
    this.name = name;
    this.cause = cause;
  }

  toJSON(): ErrorJSON {
    return { message: this.message, action: this.action, name: this.name };
  }
}

type ErrorJSON = {
  message: string;
  action: string;
  name: string;
};

export class InvalidInputError extends BaseError {
  constructor({
    action = 'Revise os dados enviados.',
    message = 'Valores inválidos.',
    cause,
  }: ChildeErrorParams = {}) {
    super({ action, message, name: 'InvalidInputError', cause });
  }
}

export class InternalError extends BaseError {
  constructor({
    action = 'Verifique o status dos serviços e stack trace do erro paa mais informações.',
    message = 'Houve um erro interno da aplicação.',
    cause,
  }: ChildeErrorParams = {}) {
    super({ action, message, name: 'InternalError', cause });
  }

  toJSON(): ErrorJSON {
    return {
      action: 'Tente novamente mais tarde ou contate suporte.',
      message: 'Ocorreu um erro interno.',
      name: 'InternalError',
    };
  }
}

export class ImplementationError extends InternalError {
  constructor({
    action = 'Verifique a stack trace do erro e documentação e veja o que precisa de ajuste.',
    message = 'Houve um erro na implementação.',
    cause,
  }: ChildeErrorParams = {}) {
    super({ action, message, cause });
    this.name = 'ImplementaionError';
  }
}

type ErrorParams = {
  message: string;
  action: string;
  name: string;
  cause?: unknown;
};

type ChildeErrorParams = Partial<Omit<ErrorParams, 'name'>>;
