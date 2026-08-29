CREATE TYPE "AutomationFrequency" AS ENUM ('DAILY', 'WEEKLY');
CREATE TYPE "ReportType" AS ENUM ('DAILY_OPERATIONAL', 'WEEKLY_OPERATIONAL', 'ON_DEMAND');
CREATE TYPE "ReportStatus" AS ENUM ('GENERATED', 'QUEUED', 'DELIVERED', 'FAILED');
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

CREATE TABLE "Automation" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "frequency" "AutomationFrequency" NOT NULL,
  "timezone" TEXT NOT NULL,
  "recipients" JSONB NOT NULL,
  "nextRunAt" TIMESTAMP(3) NOT NULL,
  "lastRunAt" TIMESTAMP(3),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OperationalReport" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "automationId" UUID,
  "type" "ReportType" NOT NULL,
  "status" "ReportStatus" NOT NULL DEFAULT 'GENERATED',
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "content" TEXT NOT NULL,
  "metrics" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OperationalReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WhatsAppDelivery" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "reportId" UUID NOT NULL,
  "recipient" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "workerId" TEXT,
  "startedAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "providerMessageId" TEXT,
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WhatsAppDelivery_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookEvent" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "provider" TEXT NOT NULL,
  "providerEventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Automation_organizationId_nextRunAt_active_idx" ON "Automation"("organizationId", "nextRunAt", "active");
CREATE INDEX "OperationalReport_organizationId_createdAt_idx" ON "OperationalReport"("organizationId", "createdAt");
CREATE INDEX "OperationalReport_automationId_createdAt_idx" ON "OperationalReport"("automationId", "createdAt");
CREATE UNIQUE INDEX "WhatsAppDelivery_organizationId_idempotencyKey_key" ON "WhatsAppDelivery"("organizationId", "idempotencyKey");
CREATE INDEX "WhatsAppDelivery_status_nextAttemptAt_createdAt_idx" ON "WhatsAppDelivery"("status", "nextAttemptAt", "createdAt");
CREATE INDEX "WhatsAppDelivery_organizationId_status_createdAt_idx" ON "WhatsAppDelivery"("organizationId", "status", "createdAt");
CREATE INDEX "WhatsAppDelivery_reportId_idx" ON "WhatsAppDelivery"("reportId");
CREATE UNIQUE INDEX "WebhookEvent_provider_providerEventId_key" ON "WebhookEvent"("provider", "providerEventId");
CREATE INDEX "WebhookEvent_organizationId_createdAt_idx" ON "WebhookEvent"("organizationId", "createdAt");
CREATE INDEX "WebhookEvent_processedAt_createdAt_idx" ON "WebhookEvent"("processedAt", "createdAt");

ALTER TABLE "Automation" ADD CONSTRAINT "Automation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperationalReport" ADD CONSTRAINT "OperationalReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperationalReport" ADD CONSTRAINT "OperationalReport_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WhatsAppDelivery" ADD CONSTRAINT "WhatsAppDelivery_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WhatsAppDelivery" ADD CONSTRAINT "WhatsAppDelivery_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "OperationalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
