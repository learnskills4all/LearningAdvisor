export const aSubarea = {
  subarea_id: 1,
  subarea_name: 'Subarea 1',
  subarea_description: 'Subarea 1 description',
  subarea_summary: 'Subarea 1 summary',
  category_id: 1,
  order: 1,
};

export const mockSubarea = {
  findUnique: jest.fn().mockResolvedValue(aSubarea),
  findMany: jest.fn().mockResolvedValue([aSubarea]),
  create: jest.fn().mockResolvedValue(aSubarea),
  update: jest.fn().mockResolvedValue(aSubarea),
  delete: jest.fn().mockResolvedValue(aSubarea),
  count: jest.fn().mockResolvedValue(1),
  updateMany: jest.fn().mockResolvedValue([aSubarea]),
  createMany: jest.fn().mockResolvedValue({}),
};
