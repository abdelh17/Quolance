export const isDeepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key in a) {
    if (!isDeepEqual(a[key], b[key])) return false;
  }

  return true;
};

export const isShallowEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }

  return true;
};
