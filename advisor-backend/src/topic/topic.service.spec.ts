import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { TopicService } from './topic.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { aTopic, topicsList } from '../prisma/mock/mockTopic';
import { Role } from '@prisma/client';
import { aCheckpoint } from '../prisma/mock/mockCheckpoint';

const moduleMocker = new ModuleMocker(global);

describe('TopicService', () => {
  let topicService: TopicService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
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

    topicService = module.get<TopicService>(TopicService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(topicService).toBeDefined();
  });

  describe('create', () => {
    it('should create topic', async () => {
      const topic = await topicService.create(1);
      expect(topic).toBeDefined();
    });

    it('should throw error if topic with this name already exists', async () => {
      jest
        .spyOn(prisma.topic, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(topicService.create(1)).rejects.toThrowError(ConflictException);
    });

    it('should throw error if template with id does not exist', async () => {
      jest
        .spyOn(prisma.topic, 'create')
        .mockRejectedValueOnce({ code: 'P2003' });
      expect(topicService.create(1)).rejects.toThrowError(NotFoundException);
    });

    it('Should throw InternalServerException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.topic, 'create')
        .mockRejectedValueOnce({ code: 'P2004' });
      expect(topicService.create(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('findOne', () => {
    it('Should return the found topic', async () => {
      expect(topicService.findOne(1)).resolves.toBe(aTopic);
    });

    it('Should throw error if topic with this id does not exist', async () => {
      jest.spyOn(prisma.topic, 'findUnique').mockResolvedValueOnce(null);
      expect(topicService.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('Should return all topics in template for admins', async () => {
      expect(topicService.findAll(1, Role.ADMIN)).resolves.toBe(topicsList);
    });

    it('Should return all enabled topics in template for users', async () => {
      expect(topicService.findAll(1, Role.USER)).resolves.toHaveLength(2);
    });
  });

  describe('update', () => {
    it('Should return the updated topic', async () => {
      expect(topicService.update(1, aTopic)).resolves.toBe(aTopic);
    });

    it('Should throw error if topic with this id does not exist', async () => {
      jest
        .spyOn(prisma.topic, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(topicService.update(1, aTopic)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw error if topic with this name already exists', async () => {
      jest
        .spyOn(prisma.topic, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(topicService.update(1, aTopic)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw InternalServerException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.topic, 'update')
        .mockRejectedValueOnce({ code: 'P2004' });
      expect(topicService.update(1, aTopic)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('delete', () => {
    it('Should return the deleted topic', async () => {
      expect(topicService.delete(1)).resolves.toBe(aTopic);
    });

    it('Should throw error if topic with this id does not exist', async () => {
      jest
        .spyOn(prisma.topic, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(topicService.delete(1)).rejects.toThrowError(NotFoundException);
    });

    it('Should throw InternalServerException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.topic, 'delete')
        .mockRejectedValueOnce({ code: 'P2004' });
      expect(topicService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('updateTopics', () => {
    it('Should return the updated topics', async () => {
      expect(topicService.updateTopics(aCheckpoint, [1])).resolves.toHaveLength(
        2
      );
    });
  });
});
