export function buildClaimDeliveryQuery(workerId: string) {
  return {
    sql: `
      UPDATE "WhatsAppDelivery"
      SET "status" = 'PROCESSING',
          "workerId" = ?,
          "startedAt" = NOW(),
          "updatedAt" = NOW()
      WHERE "id" = (
        SELECT "id"
        FROM "WhatsAppDelivery"
        WHERE "status" = 'PENDING'
          AND "nextAttemptAt" <= NOW()
        ORDER BY "nextAttemptAt", "createdAt"
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    `,
    bindings: [workerId],
  };
}
