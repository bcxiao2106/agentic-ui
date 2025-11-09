import type { UIForm } from '../agents/agent.ui.js';

export const generateFormFromModel = (model: any): UIForm => {
  const component = `${model?.entity ?? 'Entity'}Form`;
  const fields = (model?.attributes ?? []).map((a: any) => ({ name: a.name, type: 'input-text', label: a.name }));
  return { component, fields };
};
