// Basit bir in-memory cache

export function getCache<T = any>(key: string): T | undefined {
  const value = sessionStorage.getItem(key);
  if (value === null) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export function setCache<T = any>(key: string, value: T) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function clearCache(key?: string) {
  if (key) sessionStorage.removeItem(key);
  else sessionStorage.clear();
}
