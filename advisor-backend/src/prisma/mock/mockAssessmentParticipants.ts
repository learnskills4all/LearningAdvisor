export const aAssessmentParticipant = {
  assessment_id: 1,
  user_id: 1,
};

export const mockAssessmentParticipants = {
  findMany: jest.fn().mockResolvedValue([aAssessmentParticipant]),
  deleteMany: jest.fn().mockResolvedValue(aAssessmentParticipant),
  create: jest.fn().mockResolvedValue(aAssessmentParticipant),
};
