import { ImplementationError, InternalError, InvalidInputError } from '@/infra/errors';

describe('infra/errors.ts', () => {
  describe('InvalidInputError', () => {
    it('With no custom "action" and "message"', () => {
      const error = new InvalidInputError();
      expect(error.action).toBe('Revise os dados enviados.');
      expect(error.message).toBe('Valores inválidos.');
    });
    it('With custom "action" and "message"', () => {
      const error = new InvalidInputError({
        action: 'Ação customizada',
        message: 'Mensagem customizada',
      });
      expect(error.action).toBe('Ação customizada');
      expect(error.message).toBe('Mensagem customizada');
    });
    it('Call "toJSON" method', () => {
      const error = new InvalidInputError({
        action: 'Ação customizada',
        message: 'Mensagem customizada',
      });
      expect(error.toJSON()).toEqual({
        message: 'Mensagem customizada',
        action: 'Ação customizada',
        name: 'InvalidInputError',
      });
    });
  });
  describe('ImplementationError', () => {
    it('With no custom "action" and "message"', () => {
      const error = new ImplementationError();
      expect(error.action).toBe(
        'Verifique a stack trace do erro e documentação e veja o que precisa de ajuste.',
      );
      expect(error.message).toBe('Houve um erro na implementação.');
    });
    it('With custom "action" and "message"', () => {
      const error = new ImplementationError({
        action: 'Ação customizada',
        message: 'Mensagem customizada',
      });
      expect(error.action).toBe('Ação customizada');
      expect(error.message).toBe('Mensagem customizada');
    });
    it('Call "toJSON" method', () => {
      const error = new ImplementationError({
        action: 'Ação customizada',
        message: 'Mensagem customizada',
      });
      expect(error.toJSON()).toEqual({
        message: 'Ocorreu um erro interno.',
        action: 'Tente novamente mais tarde ou contate suporte.',
        name: 'InternalError',
      });
    });
  });
  describe('InternalError', () => {
    it('With no custom "action" and "message"', () => {
      const error = new InternalError();
      expect(error.action).toBe(
        'Verifique o status dos serviços e stack trace do erro paa mais informações.',
      );
      expect(error.message).toBe('Houve um erro interno da aplicação.');
    });
    it('With custom "action" and "message"', () => {
      const error = new InternalError({
        action: 'Ação customizada',
        message: 'Mensagem customizada',
      });
      expect(error.action).toBe('Ação customizada');
      expect(error.message).toBe('Mensagem customizada');
    });
    it('Call "toJSON" method', () => {
      const error = new ImplementationError({
        action: 'Ação customizada',
        message: 'Mensagem customizada',
      });
      expect(error.toJSON()).toEqual({
        message: 'Ocorreu um erro interno.',
        action: 'Tente novamente mais tarde ou contate suporte.',
        name: 'InternalError',
      });
    });
  });
});
