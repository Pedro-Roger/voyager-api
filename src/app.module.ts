import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EvolutionModule } from './integrations/evolution/evolution.module';

@Module({
  imports: [HealthModule, DatabaseModule, AuthModule, EvolutionModule],
})
export class AppModule {}
