import { ReportComposer } from './report-composer';

describe('ReportComposer', () => {
  it('composes a factual daily WhatsApp report', () => {
    const composer = new ReportComposer();

    const message = composer.composeDaily({
      organizationName: 'Prefeitura de Exemplo',
      periodLabel: '29/08/2026',
      activeAgreements: 142,
      openIssues: 28,
      criticalIssues: 4,
      overdueTasks: 7,
      blockedAmountInCents: 240000000,
    });

    expect(message).toContain('*Voyager | Resumo diário*');
    expect(message).toContain('Prefeitura de Exemplo');
    expect(message).toContain('Convênios ativos: 142');
    expect(message).toContain('Pendências críticas: 4');
    expect(message).toContain('Tarefas atrasadas: 7');
    expect(message).toContain('Recursos bloqueados: R$ 2.400.000,00');
    expect(message).not.toContain('undefined');
  });
});
