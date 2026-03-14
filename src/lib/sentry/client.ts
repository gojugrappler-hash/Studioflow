/**
 * Sentry Error Tracking Integration
 * 
 * Provides error tracking and performance monitoring.
 * Requires: SENTRY_DSN environment variable.
 * 
 * Status: SCAFFOLD — not active until Sentry DSN is configured.
 * To activate: Install @sentry/nextjs and run the setup wizard.
 */

export function isSentryConfigured(): boolean {
  return !!process.env.SENTRY_DSN;
}

export function getSentryDSN(): string | null {
  return process.env.SENTRY_DSN || null;
}

/**
 * Manual error reporting (for catch blocks where Sentry SDK isn't auto-capturing)
 * Once @sentry/nextjs is installed, replace this with Sentry.captureException()
 */
export function reportError(error: Error, context?: Record<string, unknown>): void {
  if (!isSentryConfigured()) {
    console.error('[Sentry not configured] Error:', error.message, context);
    return;
  }
  // TODO: Replace with Sentry.captureException(error, { extra: context })
  console.error('[Sentry] Would report:', error.message, context);
}

/**
 * Performance transaction tracking
 * Once @sentry/nextjs is installed, replace with Sentry.startTransaction()
 */
export function startTransaction(name: string, op: string): { finish: () => void } {
  if (!isSentryConfigured()) {
    return { finish: () => {} };
  }
  const start = performance.now();
  return {
    finish: () => {
      const duration = performance.now() - start;
      console.log(`[Sentry] Transaction "${name}" (${op}): ${duration.toFixed(1)}ms`);
    },
  };
}
