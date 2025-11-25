const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const DEFAULT_INTERVAL_MINUTES = 5;

async function prunePastEvents() {
  const now = new Date();
  try {
    const removedRegistrations = await prisma.eventRegistration.deleteMany({
      where: { event: { date: { lt: now } } },
    });

    const removedEvents = await prisma.event.deleteMany({
      where: { date: { lt: now } },
    });

    if (removedEvents.count > 0) {
      console.log(
        `[event-cleanup] Removed ${removedEvents.count} past event(s) and ${removedRegistrations.count} registration(s).`,
      );
    }
  } catch (error) {
    console.error('[event-cleanup] Failed pruning past events:', error);
  }
}

function startEventCleanup(intervalMinutes) {
  const minutes = Number.isFinite(intervalMinutes) ? intervalMinutes : DEFAULT_INTERVAL_MINUTES;
  const intervalMs = Math.max(minutes, 1) * 60 * 1000;
  prunePastEvents();
  setInterval(prunePastEvents, intervalMs);
}

module.exports = { startEventCleanup };

