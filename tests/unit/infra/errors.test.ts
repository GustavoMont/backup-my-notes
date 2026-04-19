import { InvalidInputError } from '@/infra/errors';

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
