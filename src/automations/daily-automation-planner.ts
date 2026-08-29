import { DailyReportMetrics, ReportComposer } from '../reports/report-composer';
import { normalizeWhatsAppRecipient } from './outbox-policy';

type PlanDailyAutomationInput = {
  organizationId: string;
  organizationName: string;
  periodStart: Date;
  periodEnd: Date;
  recipients: string[];
  metrics: Omit<DailyReportMetrics, 'organizationName' | 'periodLabel'>;
};

export class DailyAutomationPlanner {
  constructor(private readonly composer = new ReportComposer()) {}

  plan(input: PlanDailyAutomationInput) {
    const periodKey = input.periodEnd.toISOString().slice(0, 10);
    const [year, month, day] = periodKey.split('-');
    const content = this.composer.composeDaily({
      ...input.metrics,
      organizationName: input.organizationName,
      periodLabel: `${day}/${month}/${year}`,
    });
    const recipients = [...new Set(input.recipients.map(normalizeWhatsAppRecipient))];

    return {
      report: {
        organizationId: input.organizationId,
        type: 'DAILY_OPERATIONAL' as const,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        content,
        metrics: input.metrics,
      },
      deliveries: recipients.map((recipient) => ({
        organizationId: input.organizationId,
        recipient,
        message: content,
        idempotencyKey: `daily:${input.organizationId}:${periodKey}:${recipient}`,
      })),
    };
  }
}
