function deepClone(v, seen = new WeakMap()) {
  if (v == null || typeof v !== 'object') return v;
  if (seen.has(v)) return seen.get(v);

  if (v instanceof Date) {
    const c = new Date(v);
    seen.set(v, c);
    return c;
  }
  if (v instanceof Map) {
    const c = new Map();
    seen.set(v, c);
    v.forEach((val, key) => c.set(deepClone(key, seen), deepClone(val, seen)));
    return c;
  }
  if (v instanceof Set) {
    const c = new Set();
    seen.set(v, c);
    v.forEach((x) => c.add(deepClone(x, seen)));
    return c;
  }

  const c = Array.isArray(v) ? [] : Object.create(Object.getPrototypeOf(v));
  seen.set(v, c);

  if (Array.isArray(v)) {
    v.forEach((x, i) => (c[i] = deepClone(x, seen)));
  } else {
    Reflect.ownKeys(v).forEach((k) => {
      const d = Object.getOwnPropertyDescriptor(v, k);
      if (d && 'value' in d) d.value = deepClone(d.value, seen);
      if (d) Object.defineProperty(c, k, d);
    });
  }
  return c;
}