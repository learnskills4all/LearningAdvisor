import { CheckpointInTopic } from '@prisma/client';

export const aCheckPointInTopic: CheckpointInTopic = {
  checkpoint_id: 1,
  topic_id: 1,
};

export const mockCheckpointInTopic = {
  createMany: jest.fn().mockResolvedValue(1),
  deleteMany: jest.fn().mockResolvedValue(1),
  findMany: jest.fn().mockResolvedValue([aCheckPointInTopic]),
};
