import { EnvDTOType, envDTO } from '@/dtos/env.dto';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({
  path: [resolve('.env'), resolve('.env.development')],
});

class EnvManager {
  getEnv(): NodeJS.ProcessEnv {
    return process.env;
  }

  getVariables(): EnvDTOType {
    const { data, error } = envDTO.safeParse(this.getEnv());
    if (error) {
      console.warn(error);
      return {
        GOOGLE_VISION_JSON_API_KEY: this.getEnv().GOOGLE_VISION_JSON_API_KEY || '',
        NODE_ENV: 'development',
      };
    }
    return data;
  }

  getVariable(varName: keyof EnvDTOType): string | number | undefined {
    const env = this.getVariables()[varName];
    return env ?? undefined;
  }
}

export const envManager = new EnvManager();
