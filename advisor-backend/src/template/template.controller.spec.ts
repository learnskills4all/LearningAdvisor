import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aTemplate } from '../prisma/mock/mockTemplate';
import { TemplateService } from './template.service';
import { CategoryService } from '../category/category.service';
import { aCategory } from '../prisma/mock/mockCategory';
import { aMaturity } from '../prisma/mock/mockMaturity';
import { MaturityService } from '../maturity/maturity.service';
import { CloneTemplateService } from './clone-template.service';
import { aFullUser } from '../prisma/mock/mockUser';
import { aTopic } from '../prisma/mock/mockTopic';
import { TopicService } from '../topic/topic.service';
import { AnswerService } from '../answer/answer.service';
import { aAnswer } from '../prisma/mock/mockAnswer';

const moduleMocker = new ModuleMocker(global);

/**
 * Test template controller
 */
describe('TemplateController', () => {
  let templateController: TemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
    })
      .useMocker((token) => {
        if (token === TemplateService) {
          return {
            create: jest.fn().mockResolvedValue(aTemplate),
            findOne: jest.fn().mockResolvedValue(aTemplate),
            update: jest.fn().mockResolvedValue(aTemplate),
            findAll: jest.fn().mockResolvedValue([aTemplate]),
            delete: jest.fn().mockResolvedValue(aTemplate),
          };
        }
        if (token === CloneTemplateService) {
          return {
            clone: jest.fn().mockResolvedValue(aTemplate),
          };
        }
        if (token === CategoryService) {
          return {
            create: jest.fn().mockResolvedValue(aCategory),
            findAll: jest.fn().mockResolvedValue([aCategory]),
          };
        }
        if (token === MaturityService) {
          return {
            create: jest.fn().mockResolvedValue(aMaturity),
            findAll: jest.fn().mockResolvedValue([aMaturity]),
          };
        }
        if (token === TopicService) {
          return {
            create: jest.fn().mockResolvedValue(aTopic),
            findAll: jest.fn().mockResolvedValue([aTopic]),
          };
        }
        if (token === AnswerService) {
          return {
            create: jest.fn().mockResolvedValue(aAnswer),
            findAll: jest.fn().mockResolvedValue([aAnswer]),
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

    templateController = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(templateController).toBeDefined();
  });

  describe('createTemplate', () => {
    it('Should return the created template', async () => {
      expect(
        templateController.create({
          template_type: 'INDIVIDUAL',
        })
      ).resolves.toBe(aTemplate);
    });
  });

  describe('getTemplate', () => {
    it('Should return the found template', async () => {
      expect(templateController.findOne(1)).resolves.toBe(aTemplate);
    });
  });

  describe('updateTemplate', () => {
    it('Should return the updated template', async () => {
      expect(templateController.update(1, aTemplate)).resolves.toBe(aTemplate);
    });
  });

  describe('deleteTemplate', () => {
    it('Should return the deleted template', async () => {
      expect(templateController.delete(1)).resolves.toBe(aTemplate);
    });
  });

  describe('getAllTemplates', () => {
    it('Should return all templates', async () => {
      expect(templateController.findAll(aFullUser)).resolves.toEqual(
        expect.arrayContaining([aTemplate])
      );
    });
  });

  describe('cloneTemplate', () => {
    it('Should return the cloned template', async () => {
      expect(templateController.clone(1)).resolves.toBe(aTemplate);
    });
  });

  describe('createCategory', () => {
    it('Should return the created category', async () => {
      expect(templateController.createCategory(1)).resolves.toBe(aCategory);
    });
  });

  describe('getAllCategories', () => {
    it('Should return all categories', async () => {
      expect(
        templateController.findAllCategories(1, aFullUser)
      ).resolves.toEqual([aCategory]);
    });
  });

  describe('createMaturity', () => {
    it('Should return the created maturity', async () => {
      expect(templateController.createMaturity(1)).resolves.toBe(aMaturity);
    });
  });

  describe('getAllMaturities', () => {
    it('Should return all maturities', async () => {
      expect(
        templateController.findAllMaturities(1, aFullUser)
      ).resolves.toEqual([aMaturity]);
    });
  });

  describe('findAllTopics', () => {
    it('Should return the topics', async () => {
      expect(templateController.findAllTopics(1, aFullUser)).resolves.toEqual([
        aTopic,
      ]);
    });
  });

  describe('createTopic', () => {
    it('Should return the created topic', async () => {
      expect(templateController.createTopic(1)).resolves.toBe(aTopic);
    });
  });

  describe('getAnswers', () => {
    it('Should return the answers', async () => {
      expect(templateController.getAnswers(1, aFullUser)).resolves.toEqual([
        aAnswer,
      ]);
    });
  });

  describe('createAnswer', () => {
    it('Should return the created answer', async () => {
      expect(templateController.createAnswer(1)).resolves.toBe(aAnswer);
    });
  });
});
