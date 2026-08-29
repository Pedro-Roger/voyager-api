import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildRuntimeEnv } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = buildRuntimeEnv();

  await app.listen(env.apiPort);
}

void bootstrap();
