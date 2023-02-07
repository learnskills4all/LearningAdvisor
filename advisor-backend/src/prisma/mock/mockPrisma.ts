import { mockAssessment } from './mockAssessment';
import { mockCategory } from './mockCategory';
import { mockAssessmentParticipants } from './mockAssessmentParticipants';
import { mockMaturity } from './mockMaturity';
import { mockTeam } from './mockTeam';
import { mockTemplate } from './mockTemplate';
import { mockUser } from './mockUser';
import { mockUserInTeam } from './mockUserInTeam';
import { mockSubarea } from './mockSubarea';
import { mockCheckpoint } from './mockCheckpoint';
import { mockTopic } from './mockTopic';
import { mockCheckpointInTopic } from './mockCheckpointInTopic';
import { mockAnswer } from './mockAnswer';
import { mockFeedback } from './mockFeedback';
import { mockCheckpointAndAnswersInAssessment } from './mockCheckpointAndAnswersInAssessments';

export const mockPrisma = {
  template: mockTemplate,
  user: mockUser,
  userInTeam: mockUserInTeam,
  assessment: mockAssessment,
  team: mockTeam,
  category: mockCategory,
  assessmentParticipants: mockAssessmentParticipants,
  maturity: mockMaturity,
  subArea: mockSubarea,
  checkpoint: mockCheckpoint,
  topic: mockTopic,
  checkpointInTopic: mockCheckpointInTopic,
  answer: mockAnswer,
  feedback: mockFeedback,
  checkpointAndAnswersInAssessments: mockCheckpointAndAnswersInAssessment,
};
