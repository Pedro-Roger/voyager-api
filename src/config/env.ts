import { z } from 'zod';

const envSchema = z.object({
  API_PORT: z.coerce.number().int().positive(),
  APP_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  DEV_AUTH_EMAIL: z.string().min(1),
  DEV_AUTH_ORGANIZATION_ID: z.string().uuid(),
  DEV_AUTH_PASSWORD: z.string().min(1),
  DEV_AUTH_ROLE: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'VIEWER']),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  TZ: z.string().min(1),
});

export type RuntimeEnv = {
  apiPort: number;
  appOrigin: string;
  databaseUrl: string;
  devAuthEmail: string;
  devAuthOrganizationId: string;
  devAuthPassword: string;
  devAuthRole: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'VIEWER';
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  timezone: string;
};

export function buildEnv(source: Record<string, string | undefined>): RuntimeEnv {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error('Invalid environment configuration');
  }

  return {
    apiPort: result.data.API_PORT,
    appOrigin: result.data.APP_ORIGIN,
    databaseUrl: result.data.DATABASE_URL,
    devAuthEmail: result.data.DEV_AUTH_EMAIL,
    devAuthOrganizationId: result.data.DEV_AUTH_ORGANIZATION_ID,
    devAuthPassword: result.data.DEV_AUTH_PASSWORD,
    devAuthRole: result.data.DEV_AUTH_ROLE,
    jwtAccessSecret: result.data.JWT_ACCESS_SECRET,
    jwtRefreshSecret: result.data.JWT_REFRESH_SECRET,
    timezone: result.data.TZ,
  };
}

export function buildRuntimeEnv() {
  return buildEnv(process.env);
}
