export type DailyReportMetrics = {
  organizationName: string;
  periodLabel: string;
  activeAgreements: number;
  openIssues: number;
  criticalIssues: number;
  overdueTasks: number;
  blockedAmountInCents: number;
};

export class ReportComposer {
  composeDaily(metrics: DailyReportMetrics) {
    const blockedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(metrics.blockedAmountInCents / 100).replace(/\u00a0/g, ' ');

    return [
      '*Voyager | Resumo diário*',
      `${metrics.organizationName} - ${metrics.periodLabel}`,
      '',
      `Convênios ativos: ${metrics.activeAgreements}`,
      `Pendências abertas: ${metrics.openIssues}`,
      `Pendências críticas: ${metrics.criticalIssues}`,
      `Tarefas atrasadas: ${metrics.overdueTasks}`,
      `Recursos bloqueados: ${blockedAmount}`,
      '',
      'Consulte o Voyager para detalhes e responsáveis.',
    ].join('\n');
  }
}
