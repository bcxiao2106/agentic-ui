export const translateKeys = async (keys: Record<string,string>, target: string) => {
  // Identity translation stub. Replace with real translator later.
  const out: Record<string,string> = {};
  for (const k of Object.keys(keys)) out[k] = (keys as Record<string,string>)[k] ?? '';
  return out;
};
