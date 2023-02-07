export const aCheckpoint = {
  checkpoint_id: 1,
  category_id: 1,
  maturity_id: 1,
  disabled: false,
  order: 1,
  weight: 1,
  checkpoint_additional_information: 'Checkpoint 1 additional information',
  checkpoint_description: 'Checkpoint 1 description',
  topics: [],
  Category: {
    template_id: 1,
    order: 1,
  },
  Maturity: {
    order: 1,
  },
  CheckpointInTopic: [
    {
      topic_id: 1,
      checkpoint_id: 1,
    },
  ],
};

export const aCheckpoint1 = {
  checkpoint_id: 1,
  maturity_id: 1,
  category_id: 1,
  disabled: false,
};

export const aCheckpointFull = {
  ...aCheckpoint1,
  checkpoint_description: 'test_checkpoint_description',
  checkpoint_additional_information: 'test_checkpoint_additional_information',
  order: 1,
  weight: 1,
  disabled: false,
  CheckpointInTopic: [
    {
      checkpoint_id: aCheckpoint1.checkpoint_id,
      topic_id: 1,
    },
  ],
  CheckpointAndAnswersInAssessments: [
    {
      checkpoint_id: aCheckpoint1.checkpoint_id,
      assessment_id: 1,
      answer_id: 1,
    },
  ],
};

export const mockCheckpoint = {
  create: jest.fn().mockResolvedValue(aCheckpoint),
  findUnique: jest.fn().mockResolvedValue(aCheckpoint),
  findMany: jest.fn().mockResolvedValue([aCheckpoint]),
  update: jest.fn().mockResolvedValue(aCheckpoint),
  count: jest.fn().mockResolvedValue(1),
  delete: jest.fn().mockResolvedValue(aCheckpoint),
  updateMany: jest.fn().mockResolvedValue([aCheckpoint]),
  createMany: jest.fn().mockResolvedValue({}),
};
