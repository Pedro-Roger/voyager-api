import { DailyAutomationPlanner } from './daily-automation-planner';

describe('DailyAutomationPlanner', () => {
  it('creates one idempotent delivery per normalized recipient', () => {
    const planner = new DailyAutomationPlanner();
    const result = planner.plan({
      organizationId: '10000000-0000-4000-8000-000000000001',
      organizationName: 'Prefeitura de Exemplo',
      periodStart: new Date('2026-08-29T00:00:00.000Z'),
      periodEnd: new Date('2026-08-29T23:59:59.000Z'),
      recipients: ['+55 (85) 99999-1111', '5585988882222'],
      metrics: {
        activeAgreements: 12,
        openIssues: 5,
        criticalIssues: 1,
        overdueTasks: 2,
        blockedAmountInCents: 500000,
      },
    });

    expect(result.report.type).toBe('DAILY_OPERATIONAL');
    expect(result.deliveries).toHaveLength(2);
    expect(result.deliveries[0]).toMatchObject({
      recipient: '5585999991111',
      idempotencyKey: 'daily:10000000-0000-4000-8000-000000000001:2026-08-29:5585999991111',
    });
    expect(result.deliveries[0].message).toBe(result.report.content);
  });
});
