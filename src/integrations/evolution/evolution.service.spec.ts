import { EvolutionService, JsonTransport } from './evolution.service';

describe('EvolutionService', () => {
  it('sends text using the Evolution API contract', async () => {
    const post = jest.fn().mockResolvedValue({ key: { id: 'message-1' } });
    const transport: JsonTransport = { post };
    const service = new EvolutionService(
      {
        baseUrl: 'https://evolution.example.com',
        instance: 'voyager',
        apiKey: 'secret-key',
      },
      transport,
    );

    const result = await service.sendText('5585999991111', 'Resumo Voyager');

    expect(post).toHaveBeenCalledWith(
      'https://evolution.example.com/message/sendText/voyager',
      { number: '5585999991111', text: 'Resumo Voyager' },
      { apikey: 'secret-key', 'content-type': 'application/json' },
    );
    expect(result).toEqual({ providerMessageId: 'message-1' });
  });
});
