/**
 * Safe error logger. Strips PostgREST internals so we never leak
 * table/column names or DB hints to the browser console.
 */
export function logError(context: string, _err?: unknown) {
  // Intentionally drop the raw error object; only emit a stable label.
  // For real observability, forward to a server-side log sink.
  console.error(`[error] ${context}`);
}
