export const aCategory = {
  category_id: 1,
  category_name: 'Category 1',
  color: '#FF0000',
  disabled: false,
  template_id: 1,
  order: 1,
  Template: {
    weight_range_min: 1,
  },
};

export const mockCategory = {
  create: jest.fn().mockResolvedValue(aCategory),
  update: jest.fn().mockResolvedValue(aCategory),
  delete: jest.fn().mockResolvedValue(aCategory),
  findUnique: jest.fn().mockResolvedValue(aCategory),
  findMany: jest.fn().mockResolvedValue([aCategory]),
  count: jest.fn().mockResolvedValue(1),
  updateMany: jest.fn().mockResolvedValue([aCategory]),
};
