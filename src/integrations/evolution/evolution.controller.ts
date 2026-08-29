import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { EvolutionWebhookPayload, EvolutionWebhookService } from './evolution-webhook.service';

@Controller('webhooks/evolution')
export class EvolutionController {
  constructor(private readonly webhooks: EvolutionWebhookService) {}

  @Post()
  @HttpCode(202)
  receive(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() payload: EvolutionWebhookPayload,
  ) {
    return this.webhooks.receive(secret, payload);
  }
}
