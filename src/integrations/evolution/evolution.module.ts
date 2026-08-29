import { Module } from '@nestjs/common';
import { EvolutionController } from './evolution.controller';
import { EvolutionWebhookService, InMemoryWebhookEventStore } from './evolution-webhook.service';

@Module({
  controllers: [EvolutionController],
  providers: [
    {
      provide: EvolutionWebhookService,
      useFactory: () => new EvolutionWebhookService(
        new InMemoryWebhookEventStore(),
        process.env.EVOLUTION_WEBHOOK_SECRET ?? '',
        process.env.EVOLUTION_API_KEY ?? '',
      ),
    },
  ],
  exports: [EvolutionWebhookService],
})
export class EvolutionModule {}
