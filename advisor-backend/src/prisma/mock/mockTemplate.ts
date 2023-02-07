import { Template } from '@prisma/client';
import { aAnswer } from './mockAnswer';
import { aCategory } from './mockCategory';
import { aMaturity } from './mockMaturity';
import { aTopic } from './mockTopic';

export const aTemplate: Template & {
  [key: string]: any;
} = {
  template_id: 1,
  template_name: 'test',
  template_description: 'test',
  template_type: 'INDIVIDUAL',
  enabled: true,
  weight_range_min: 1,
  weight_range_max: 3,
  include_no_answer: true,
  information: 'test',
  template_feedback: 'test',
  Category: [aCategory],
  Maturity: [aMaturity],
  Topic: [aTopic],
  Answers: [aAnswer],
};

export const updateTemplate = {
  template_id: 1,
  template_name: 'new_name',
  template_description: 'new_description',
  template_type: 'INDIVIDUAL',
  disabled: false,
  weight_range_min: 1,
  weight_range_max: 5,
  include_no_answer: true,
  Category: [],
};

export const mockTemplate = {
  create: jest.fn().mockResolvedValue(aTemplate),
  findUnique: jest.fn().mockResolvedValue(aTemplate),
  findFirst: jest.fn().mockResolvedValue(aTemplate),
  count: jest.fn().mockResolvedValue(1),
  update: jest.fn().mockResolvedValue(aTemplate),
  findMany: jest.fn().mockResolvedValue([aTemplate]),
  delete: jest.fn().mockResolvedValue(aTemplate),
  updateMany: jest.fn().mockResolvedValue({}),
};
