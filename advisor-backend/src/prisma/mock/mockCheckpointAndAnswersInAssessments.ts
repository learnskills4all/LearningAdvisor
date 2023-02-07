import { CheckpointAndAnswersInAssessments } from '@prisma/client';

export const aCheckpointAndAnswerInAssessment: CheckpointAndAnswersInAssessments =
  {
    answer_id: 1,
    checkpoint_id: 1,
    assessment_id: 1,
  };

export const mockCheckpointAndAnswersInAssessment = {
  findMany: jest.fn().mockResolvedValue([aCheckpointAndAnswerInAssessment]),
  upsert: jest.fn().mockResolvedValue(aCheckpointAndAnswerInAssessment),
};
