export type LocalizationMap = Record<string, Record<string, string>>;

export const generateLocalization = async (fields: string[], langs: string[] = ['en']): Promise<LocalizationMap> => {
  const result: LocalizationMap = {};
  for (const lang of langs) {
    result[lang] = {} as Record<string, string>;
    for (const f of fields) result[lang][f] = f; // identity mapping stub
  }
  return result;
};
