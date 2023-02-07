import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { CheckpointService } from './checkpoint.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aCheckpoint } from '../prisma/mock/mockCheckpoint';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { TemplateService } from '../template/template.service';
import { TopicService } from '../topic/topic.service';

const moduleMocker = new ModuleMocker(global);

describe('CheckpointService', () => {
  beforeEach(() => {
    aCheckpoint.CheckpointInTopic = [];
  });

  let checkpointService: CheckpointService;
  let prisma: PrismaService;
  let templateService: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckpointService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
        }
        if (token === TemplateService) {
          return {
            checkWeightRange: jest.fn().mockResolvedValue(true),
          };
        }
        if (token === TopicService) {
          return {
            updateTopics: jest
              .fn()
              .mockResolvedValue(aCheckpoint.CheckpointInTopic),
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

    checkpointService = module.get<CheckpointService>(CheckpointService);
    prisma = module.get<PrismaService>(PrismaService);
    templateService = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(checkpointService).toBeDefined();
  });

  describe('create', () => {
    it('should create checkpoint', async () => {
      jest.spyOn(templateService, 'checkWeightRange').mockResolvedValue(false);
      expect(checkpointService.create(1)).resolves.toBe(aCheckpoint);
    });

    it('Should throw a ConflictException if checkpoint with description already exists', async () => {
      jest
        .spyOn(prisma.checkpoint, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(checkpointService.create(1)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw a NotFoundException if category is not found', () => {
      jest.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(null);
      expect(checkpointService.create(1)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw a NotFoundException if maturity is not found', () => {
      jest.spyOn(prisma.maturity, 'findFirst').mockResolvedValueOnce(null);
      expect(checkpointService.create(1)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw ConflictException if checkpoint with same description and category_id already exists', () => {
      jest
        .spyOn(prisma.checkpoint, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(checkpointService.create(1)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw InternalServerErrorException if something else goes wrong', () => {
      jest
        .spyOn(prisma.checkpoint, 'create')
        .mockRejectedValueOnce({ code: 'P2004' });
      expect(checkpointService.create(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should find all checkpoints', async () => {
      expect(await checkpointService.findAll(1, Role.USER)).toEqual([
        aCheckpoint,
      ]);
    });
  });

  describe('findOne', () => {
    it('should find one checkpoint', async () => {
      expect(await checkpointService.findOne(1)).toEqual(aCheckpoint);
    });

    it('should throw a NotFoundException if checkpoint is not found', async () => {
      jest.spyOn(prisma.checkpoint, 'findUnique').mockResolvedValueOnce(null);
      expect(checkpointService.findOne(1)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update checkpoint', async () => {
      expect(checkpointService.update(1, aCheckpoint)).resolves.toEqual(
        aCheckpoint
      );
    });

    it('Should throw a NotFoundException if checkpoint is not found', async () => {
      jest.spyOn(prisma.checkpoint, 'findUnique').mockResolvedValueOnce(null);
      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw a NotFoundException if maturity is not found', async () => {
      jest.spyOn(prisma.maturity, 'findUnique').mockResolvedValueOnce(null);
      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw an error if weight is out of range', async () => {
      jest
        .spyOn(templateService, 'checkWeightRange')
        .mockResolvedValueOnce(false);

      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('Should throw a BadRequestException if order is out of range', async () => {
      jest.spyOn(prisma.checkpoint, 'count').mockResolvedValueOnce(-1);
      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('Should throw a ConflictException if checkpoint with same description and category_id already exists', async () => {
      jest
        .spyOn(prisma.checkpoint, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw NotFoundException if category is not found', async () => {
      jest
        .spyOn(prisma.checkpoint, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw an InternalServerErrorException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.checkpoint, 'update')
        .mockRejectedValueOnce({ code: 'ERROR' });
      expect(checkpointService.update(1, aCheckpoint)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('delete', () => {
    it('should delete checkpoint', async () => {
      expect(await checkpointService.delete(1)).toEqual(aCheckpoint);
    });

    it('Should throw a NotFoundException if checkpoint is not found', async () => {
      jest
        .spyOn(prisma.checkpoint, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(checkpointService.delete(1)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw an InternalServerErrorException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.checkpoint, 'delete')
        .mockRejectedValueOnce({ code: 'ERROR' });
      expect(checkpointService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
