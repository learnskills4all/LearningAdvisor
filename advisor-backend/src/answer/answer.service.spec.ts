import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerService } from './answer.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aAnswer } from '../prisma/mock/mockAnswer';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Answer, Role } from '@prisma/client';

const moduleMocker = new ModuleMocker(global);

describe('AnswerService', () => {
  let answerService: AnswerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerService],
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

    answerService = module.get<AnswerService>(AnswerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(answerService).toBeDefined();
  });

  describe('create', () => {
    it('Should return the created answer', async () => {
      expect(answerService.create(1)).resolves.toBe(aAnswer);
    });

    it('Should throw an error if answer with same text already exists', async () => {
      jest
        .spyOn(prisma.answer, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(answerService.create(1)).rejects.toThrowError(ConflictException);
    });

    it('Should throw an error if template not found', async () => {
      jest
        .spyOn(prisma.answer, 'create')
        .mockRejectedValueOnce({ code: 'P2003' });
      expect(answerService.create(1)).rejects.toThrowError(NotFoundException);
    });

    it('Should throw an InternalServerErrorException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.answer, 'create')
        .mockRejectedValueOnce({ code: 'ERROR' });
      expect(answerService.create(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('findOne', () => {
    it('Should return the answer', async () => {
      expect(answerService.findOne(1)).resolves.toBe(aAnswer);
    });

    it('Should throw NotFoundException if answer not found', async () => {
      jest.spyOn(prisma.answer, 'findUnique').mockResolvedValueOnce(null);
      expect(answerService.findOne(2)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('Should return the answers', async () => {
      expect(answerService.findAll(1, Role.USER)).resolves.toEqual([
        aAnswer,
        { answer_text: 'N/A', disabled: false, template_id: 1 },
      ] as Answer[]);
    });

    it('Should throw NotFoundException if template not found', async () => {
      jest.spyOn(prisma.template, 'findUnique').mockResolvedValueOnce(null);
      expect(answerService.findAll(1, Role.USER)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('Should return the updated answer', async () => {
      expect(answerService.update(1, aAnswer)).resolves.toBe(aAnswer);
    });

    it('Should throw NotFoundException if answer not found', async () => {
      jest
        .spyOn(prisma.answer, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(answerService.update(1, aAnswer)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw error if name already exists', () => {
      jest
        .spyOn(prisma.answer, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(answerService.update(1, aAnswer)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw InternalServerException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.answer, 'update')
        .mockRejectedValueOnce({ code: 'ERROR' });
      expect(answerService.update(1, aAnswer)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('delete', () => {
    it('Should return the deleted answer', async () => {
      expect(answerService.delete(1)).resolves.toBe(aAnswer);
    });

    it('Should throw NotFoundException if answer not found', async () => {
      jest
        .spyOn(prisma.answer, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(answerService.delete(1)).rejects.toThrowError(NotFoundException);
    });

    it('Should throw InternalServerException if something else goes wrong', async () => {
      jest
        .spyOn(prisma.answer, 'delete')
        .mockRejectedValueOnce({ code: 'ERROR' });
      expect(answerService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
