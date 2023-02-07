import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import {
  aAssessment,
  aAssessmentWithOtherParticipants,
  aTeamAssessment,
  aTeamAssessmentWithOtherParticipants,
  aTeamAssessmentWithParticipants,
} from '../prisma/mock/mockAssessment';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { AssessmentService } from './assessment.service';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { aTeam } from '../prisma/mock/mockTeam';
import { AssessmentType } from '@prisma/client';
import { aFullUser } from '../prisma/mock/mockUser';
import { SaveService } from '../save/save.service';
import { AssessmentScoreService } from './assessment-score.service';

const moduleMocker = new ModuleMocker(global);

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;
  let prisma: PrismaService;
  let saveService: SaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentService, AssessmentScoreService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
        }
        if (token === SaveService) {
          return {
            areAllAnswersFilled: jest.fn().mockResolvedValue(true),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    assessmentService = module.get<AssessmentService>(AssessmentService);
    prisma = module.get<PrismaService>(PrismaService);
    saveService = module.get<SaveService>(SaveService);
  });

  it('should be defined', () => {
    expect(assessmentService).toBeDefined();
  });

  describe('create', () => {
    it('Should return the created assessment', async () => {
      expect(assessmentService.create(aAssessment, aFullUser)).resolves.toBe(
        aAssessment
      );
    });

    it('Should throw ConflictException on conflict', async () => {
      jest
        .spyOn(prisma.assessment, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });

      expect(
        assessmentService.create(aAssessment, aFullUser)
      ).rejects.toThrowError(ConflictException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.assessment, 'create')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        assessmentService.create(aAssessment, aFullUser)
      ).rejects.toThrowError(InternalServerErrorException);
    });

    it('Should reject with NotFoundException on team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(
        assessmentService.create(aTeamAssessment, aFullUser)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should reject with BadRequestException if type team but no team_id', async () => {
      const aTeamAssessment2 = {
        ...aTeamAssessment,
      };
      delete aTeamAssessment2.team_id;
      expect(
        assessmentService.create(aTeamAssessment2, aFullUser)
      ).rejects.toThrowError(BadRequestException);
    });

    it('Should reject with BadRequestException if type individual but team_id', async () => {
      const aTeamAssessment2 = {
        ...aTeamAssessment,
        assessment_type: AssessmentType.INDIVIDUAL,
      };
      expect(
        assessmentService.create(aTeamAssessment2, aFullUser)
      ).rejects.toThrowError(BadRequestException);
    });

    it('Should return created team on correct team assessment', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(aTeam);
      expect(
        assessmentService.create(aTeamAssessment, aFullUser)
      ).resolves.toBe(aAssessment);
    });

    it('Should reject with BadRequestException if no active templates were found', async () => {
      jest.spyOn(prisma.template, 'findFirst').mockResolvedValueOnce(null);
      expect(
        assessmentService.create(aAssessment, aFullUser)
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('Should return all assessments', async () => {
      expect(assessmentService.findAll()).resolves.toEqual([aAssessment]);
    });
  });

  describe('findOne', () => {
    it('Should return the found assessment', async () => {
      expect(assessmentService.findOne(aAssessment.template_id)).resolves.toBe(
        aAssessment
      );
    });

    it('Should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.assessment, 'findUnique').mockResolvedValueOnce(null);
      expect(
        assessmentService.findOne(aAssessment.template_id)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        assessmentService.findOne(aAssessment.template_id)
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('Should return the updated assessment', async () => {
      expect(
        assessmentService.update(aAssessment.assessment_id, aAssessment)
      ).resolves.toBe(aAssessment);
    });

    it('Should throw NotFoundException if not found', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(
        assessmentService.update(aAssessment.template_id, aAssessment)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw ConflictException if already exists', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(
        assessmentService.update(aAssessment.template_id, aAssessment)
      ).rejects.toThrowError(ConflictException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        assessmentService.update(aAssessment.template_id, aAssessment)
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('Should return the deleted assessment', async () => {
      expect(assessmentService.delete(aAssessment.assessment_id)).resolves.toBe(
        aAssessment
      );
    });

    it('Should throw NotFoundException if not found', async () => {
      jest
        .spyOn(prisma.assessment, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(
        assessmentService.delete(aAssessment.assessment_id)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.assessment, 'delete')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        assessmentService.delete(aAssessment.template_id)
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('complete', () => {
    it('Should return the completed assessment', async () => {
      expect(
        assessmentService.complete(aAssessment.assessment_id)
      ).resolves.toBe(aAssessment);
    });

    it('Should throw NotFoundException if not found', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(
        assessmentService.complete(aAssessment.template_id)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        assessmentService.complete(aAssessment.template_id)
      ).rejects.toThrowError(InternalServerErrorException);
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(prisma.assessment, 'findUnique').mockResolvedValueOnce(null);
      expect(
        assessmentService.complete(aAssessment.template_id)
      ).rejects.toThrow(NotFoundException);
    });

    it('Should throw error if not all checkpoints are filled when trying to \
       mark assessment as complete', async () => {
      jest
        .spyOn(saveService, 'areAllAnswersFilled')
        .mockResolvedValueOnce(false);
      expect(
        assessmentService.complete(aAssessment.template_id)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findUserAssessments', () => {
    it('Should return the user assessments', async () => {
      expect(assessmentService.findUserAssessments(aFullUser)).resolves.toEqual(
        [aAssessment]
      );
    });
  });

  describe('userInAssessment', () => {
    it('Should return assessment', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentWithOtherParticipants);
      expect.assertions(1);
      jest.spyOn(prisma.team, 'findMany').mockResolvedValueOnce([aTeam]);
      expect(
        assessmentService.userInAssessment(
          aTeamAssessmentWithOtherParticipants.assessment_id,
          aFullUser
        )
      ).resolves.toBe(aTeamAssessmentWithOtherParticipants);
    });

    it('Should return assessment if user is in assessment', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentWithParticipants);
      expect(
        assessmentService.userInAssessment(
          aTeamAssessmentWithParticipants.assessment_id,
          aFullUser
        )
      ).resolves.toBe(aTeamAssessmentWithParticipants);
    });

    it('Should return null if no assessment is found', async () => {
      jest.spyOn(prisma.assessment, 'findUnique').mockResolvedValueOnce(null);
      expect(
        assessmentService.userInAssessment(aAssessment.assessment_id, aFullUser)
      ).resolves.toBe(null);
    });

    it('Should return null if there are no participants in given assessment', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentWithOtherParticipants);
      jest.spyOn(prisma.team, 'findMany').mockResolvedValueOnce(null);
      expect(
        assessmentService.userInAssessment(
          aTeamAssessmentWithParticipants.assessment_id,
          aFullUser
        )
      ).resolves.toBe(null);
    });

    it('Should return null if user not in team and assessment is individual', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aAssessmentWithOtherParticipants);
      jest.spyOn(prisma.team, 'findMany').mockResolvedValueOnce(null);
      expect(
        assessmentService.userInAssessment(
          aAssessmentWithOtherParticipants.assessment_id,
          aFullUser
        )
      ).resolves.toBe(null);
    });
  });

  describe('Add feedback to assessment', () => {
    it('Should return the feedback', async () => {
      expect(
        assessmentService.feedback(aTeamAssessment.assessment_id, {
          feedback_text: 'test_feedback_text',
        })
      ).resolves.toStrictEqual(aAssessment);
    });

    it('Should throw NotFoundException if assessment not found', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(
        assessmentService.feedback(aTeamAssessment.assessment_id, {
          feedback_text: 'test_feedback_text',
        })
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw NotFoundException if assessment not found', async () => {
      jest
        .spyOn(prisma.assessment, 'update')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        assessmentService.feedback(aTeamAssessment.assessment_id, {
          feedback_text: 'test_feedback_text',
        })
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
