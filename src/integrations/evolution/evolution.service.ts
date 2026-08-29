export type EvolutionConfig = {
  baseUrl: string;
  instance: string;
  apiKey: string;
};

export interface JsonTransport {
  post(url: string, body: unknown, headers: Record<string, string>): Promise<unknown>;
}

export class FetchJsonTransport implements JsonTransport {
  async post(url: string, body: unknown, headers: Record<string, string>) {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Evolution request failed with status ${response.status}`);
    }
    return response.json() as Promise<unknown>;
  }
}

export class EvolutionService {
  constructor(
    private readonly config: EvolutionConfig,
    private readonly transport: JsonTransport = new FetchJsonTransport(),
  ) {}

  async sendText(recipient: string, text: string) {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const response = await this.transport.post(
      `${baseUrl}/message/sendText/${this.config.instance}`,
      { number: recipient, text },
      { apikey: this.config.apiKey, 'content-type': 'application/json' },
    ) as { key?: { id?: string } };

    return { providerMessageId: response.key?.id ?? null };
  }
}
