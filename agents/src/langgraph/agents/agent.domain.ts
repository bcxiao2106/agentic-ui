export interface DomainModel {
  entity: string;
  attributes: { name: string; type: string }[];
}

export const generateDomainModel = async (desc: any): Promise<DomainModel> => {
  // Very small stub that converts a description into a DomainModel.
  const entity = desc?.entity ?? 'Unnamed';
  const attributes = (desc?.attributes ?? []).map((a: any) => ({ name: String(a), type: 'string' }));
  return { entity, attributes };
};
