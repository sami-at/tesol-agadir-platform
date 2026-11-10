/** Reads a nested value at `path` (array of keys) within `obj`. */
export function getAtPath(obj, path) {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

/** Returns a shallow-cloned copy of `obj` with `value` set at the nested `path`. */
export function setAtPath(obj, path, value) {
  if (path.length === 0) return value;

  const [head, ...rest] = path;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  clone[head] = setAtPath(obj?.[head] ?? (rest.length ? {} : undefined), rest, value);
  return clone;
}
