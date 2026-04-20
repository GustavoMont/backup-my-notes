import z from 'zod';

export const envDTO = z.object({
  GOOGLE_VISION_JSON_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type EnvDTOType = z.infer<typeof envDTO>;
