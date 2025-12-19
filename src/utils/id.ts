/**
 * Generates a unique identifier using crypto.randomUUID()
 * Falls back to a timestamp-based ID if crypto is not available
 */
export function generateId(): string {
  // Use crypto.randomUUID() if available (modern browsers/Node)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Type guard to check if a value is a valid ID string
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}
