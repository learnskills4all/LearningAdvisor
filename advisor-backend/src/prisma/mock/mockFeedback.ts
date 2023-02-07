import { Feedback } from '@prisma/client';

export const aFeedback: Feedback = {
  assessment_id: 1,
  feedback_id: 1,
  feedback_additional_information: 'Feedback 1 additional information',
  feedback_text: 'Feedback 1 text',
  order: 1,
  topic_ids: [1],
};

export const aFeedback2: Feedback = {
  ...aFeedback,
};

export const mockFeedback = {
  findUnique: jest.fn().mockResolvedValue(aFeedback),
  findMany: jest.fn().mockResolvedValue([aFeedback]),
  create: jest.fn().mockResolvedValue(aFeedback),
  update: jest.fn().mockResolvedValue(aFeedback),
  createMany: jest.fn().mockResolvedValue([aFeedback]),
  count: jest.fn().mockResolvedValue(1),
  updateMany: jest.fn().mockResolvedValue([aFeedback]),
};
