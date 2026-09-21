export function maskString(str: string, keepLast = 4): string {
  if (!str || str.length <= keepLast) return str;
  const masked = '*'.repeat(str.length - keepLast);
  return masked + str.slice(-keepLast);
}

export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
}
