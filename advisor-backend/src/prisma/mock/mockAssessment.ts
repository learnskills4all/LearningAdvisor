import { Assessment, AssessmentType } from '@prisma/client';

export const aAssessment: Assessment = {
  assessment_id: 1,
  assessment_type: AssessmentType.INDIVIDUAL,
  country_name: 'Netherlands',
  department_name: 'Test Department',
  template_id: 1,
  completed_at: new Date(),
  created_at: new Date(),
  feedback_text: 'Test feedback',
  information: 'Test information',
  updated_at: new Date(),
  team_id: null,
};

export const aAssessmentFeedback = {
  assessment_id: 1,
  assessment_type: AssessmentType.INDIVIDUAL,
  country_name: 'Netherlands',
  department_name: 'Test Department',
  enabled: false,
  template_id: 1,
  feedback_text: 'test_feedback_text',
};

export const aTeamAssessment = {
  assessment_id: 2,
  assessment_type: AssessmentType.TEAM,
  country_name: 'Netherlands',
  department_name: 'Test Department',
  enabled: false,
  template_id: 1,
  team_id: 1,
};

export const aAssessmentFull = {
  ...aAssessment,
  feedback_text: 'test_feedback_text',
  information: 'test_information',
  created_at: new Date(),
  updated_at: new Date(),
};

export const aTeamAssessmentFull = {
  assessment_id: 2,
  assessment_type: AssessmentType.TEAM,
  country_name: 'Netherlands',
  department_name: 'Test Department',
  enabled: false,
  template_id: 1,
  team_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  completed_at: new Date(),
  feedback_text: 'test_feedback_text',
  information: 'test_information',
};

const aTeamAssessmentFullIncomplete0 = {
  ...aTeamAssessmentFull,
};
aTeamAssessmentFullIncomplete0.completed_at = null;
export const aTeamAssessmentFullIncomplete = {
  ...aTeamAssessmentFullIncomplete0,
};

export const aRecommendation = {
  feedback_id: 1,
  order: 1,
  feedback_text: 'test_feedback_text',
  feedback_additional_information: 'test_feedback_additional_information',
  topic_ids: [1],
};

export const aAssessmentWithParticipants = {
  ...aAssessment,
  information: 'test_information',
  feedback_text: 'test_feedback_text',
  team_id: null,
  created_at: new Date(),
  updated_at: new Date(),
  completed_at: new Date(),
  AssessmentParticipants: [{ user_id: 1, assessment_id: 1 }],
};

const aAssessmentWithOtherParticipants0 = {
  ...aAssessmentWithParticipants,
};
aAssessmentWithOtherParticipants0.AssessmentParticipants = [
  { user_id: 2, assessment_id: 1 },
];
export const aAssessmentWithOtherParticipants = {
  ...aAssessmentWithOtherParticipants0,
};

export const aTeamAssessmentWithParticipants = {
  ...aTeamAssessment,
  information: 'test_information',
  feedback_text: 'test_feedback_text_wow', // TODO
  team_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  completed_at: new Date(),
  AssessmentParticipants: [{ user_id: 1, assessment_id: 1 }],
};

const aTeamAssessmentWithOtherParticipants0 = {
  ...aTeamAssessmentWithParticipants,
};
aTeamAssessmentWithOtherParticipants0.AssessmentParticipants = [
  { user_id: 2, assessment_id: 1 },
];
export const aTeamAssessmentWithOtherParticipants = {
  ...aTeamAssessmentWithOtherParticipants0,
};

const aTeamAssessmentWithParticipants2 = { ...aTeamAssessmentWithParticipants };
aTeamAssessmentWithParticipants2.AssessmentParticipants = [
  { user_id: 1, assessment_id: 1 },
];
export const aTeamAssessmentWithParticipants1 = {
  ...aTeamAssessmentWithParticipants2,
};

const aAssessmentWithNoParticipants0 = { ...aAssessmentWithParticipants };
delete aAssessmentWithNoParticipants0.AssessmentParticipants;
aAssessmentWithNoParticipants0.AssessmentParticipants = [];
export const aAssessmentWithNoParticipants = {
  ...aAssessmentWithNoParticipants0,
};

export const aTeamAssessmentWithNoParticipants = {
  ...aTeamAssessmentWithParticipants,
  AssessmentParticipants: [],
};

export const mockAssessment = {
  count: jest.fn().mockResolvedValue(1),
  create: jest.fn().mockResolvedValue(aAssessment),
  findUnique: jest.fn().mockResolvedValue(aAssessment),
  update: jest.fn().mockResolvedValue(aAssessment),
  findMany: jest.fn().mockResolvedValue([aAssessment]),
  delete: jest.fn().mockResolvedValue(aAssessment),
  getAssessments: jest.fn().mockResolvedValue([aAssessment]),
};
