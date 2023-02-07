export const aTopic = {
  topic_id: 1,
  topic_name: 'test_topic_name',
  template_id: 1,
  disabled: false,
};

export const aTopic2 = {
  topic_id: 2,
  topic_name: 'Topic 2',
  template_id: 1,
  disabled: true,
};

export const topicsList = [aTopic, aTopic2];

export const mockTopic = {
  findUnique: jest.fn().mockResolvedValue(aTopic),
  findFirst: jest.fn().mockResolvedValue(aTopic),
  findMany: jest.fn().mockResolvedValue(topicsList),
  create: jest.fn().mockResolvedValue(aTopic),
  update: jest.fn().mockResolvedValue(aTopic),
  delete: jest.fn().mockResolvedValue(aTopic),
};
