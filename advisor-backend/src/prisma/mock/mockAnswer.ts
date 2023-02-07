import { Answer } from '@prisma/client';

export const aAnswer: Answer = {
  answer_id: 1,
  answer_text: 'Answer 1',
  answer_weight: 1,
  disabled: false,
  template_id: 1,
};

export const mockAnswer = {
  findUnique: jest.fn().mockResolvedValue(aAnswer),
  findMany: jest.fn().mockResolvedValue([aAnswer]),
  create: jest.fn().mockResolvedValue(aAnswer),
  update: jest.fn().mockResolvedValue(aAnswer),
  delete: jest.fn().mockResolvedValue(aAnswer),
};
