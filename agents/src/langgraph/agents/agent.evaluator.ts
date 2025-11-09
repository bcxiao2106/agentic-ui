export const evaluateConsistency = async (domain: any, ui: any, localization: any) => {
  // Basic evaluator stub that checks fields presence
  const domainFields = new Set((domain?.attributes ?? []).map((a: any) => a.name));
  const uiFields = new Set((ui?.fields ?? []).map((f: any) => f.name));
  const missingInUI = [...domainFields].filter((f) => !uiFields.has(f));
  return { ok: missingInUI.length === 0, missingInUI };
};
