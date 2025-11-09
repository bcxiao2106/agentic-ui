export interface UIField {
  name: string;
  type: string;
  label?: string;
}

export interface UIForm {
  component: string;
  fields: UIField[];
}

export const generateUIFromModel = async (model: any): Promise<UIForm> => {
  // Stub generator: create simple fields from model attributes
  const component = `${model?.entity ?? 'Entity'}Form`;
  const fields = (model?.attributes ?? []).map((a: any) => ({ name: a.name, type: 'input-text', label: a.name }));
  return { component, fields };
};
