import { envManager } from '@/infra/env-manager.infra';

describe('EnvManager', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getEnv', () => {
    it('returns process.env', () => {
      expect(envManager.getEnv()).toBe(process.env);
    });
  });

  describe('getVariables', () => {
    it('With invalid environment variables, it warns and returns values from getEnv as fallback', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(envManager, 'getEnv').mockReturnValue({
        NODE_ENV: 'invalid',
        GOOGLE_VISION_JSON_API_KEY: 'fallback-key',
      });

      const result = envManager.getVariables();

      expect(consoleSpy).toHaveBeenCalled();
      expect(result.GOOGLE_VISION_JSON_API_KEY).toBe('fallback-key');
      expect(result.NODE_ENV).toBe('development');

      consoleSpy.mockRestore();
    });

    it('With invalid environment variables and missing GOOGLE_VISION_JSON_API_KEY, it fallbacks to empty string', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(envManager, 'getEnv').mockReturnValue({
        NODE_ENV: 'invalid',
      });

      const result = envManager.getVariables();

      expect(result.GOOGLE_VISION_JSON_API_KEY).toBe('');

      consoleSpy.mockRestore();
    });
  });

  describe('getVariable', () => {
    it('With valid environment variables, it returns the correct values', () => {
      jest.spyOn(envManager, 'getEnv').mockReturnValue({
        GOOGLE_VISION_JSON_API_KEY: 'test-key',
        NODE_ENV: 'production',
      });

      expect(envManager.getVariable('GOOGLE_VISION_JSON_API_KEY')).toBe('test-key');
      expect(envManager.getVariable('NODE_ENV')).toBe('production');
    });

    it('With missing optional variables, it returns default values', () => {
      jest.spyOn(envManager, 'getEnv').mockReturnValue({
        GOOGLE_VISION_JSON_API_KEY: 'test-key',
      });

      expect(envManager.getVariable('NODE_ENV')).toBe('development');
    });

    it('When variable is not found in getVariable, returns undefined', () => {
      // @ts-expect-error it's necessary to test the code
      expect(envManager.getVariable('NON_EXISTING')).toBeUndefined();
    });
  });
});
