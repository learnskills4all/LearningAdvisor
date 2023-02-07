import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { TeamsModule } from './teams.module';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamsCRUDController } from './teams-crud.controller';
import { TeamsCRUDService } from './teams-crud.service';

const moduleMocker = new ModuleMocker(global);

describe('TemplateModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TeamsModule],
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

    expect(module).toBeDefined();
    expect(module.get(TeamsController)).toBeInstanceOf(TeamsController);
    expect(module.get(TeamsCRUDController)).toBeInstanceOf(TeamsCRUDController);
    expect(module.get(TeamsService)).toBeInstanceOf(TeamsService);
    expect(module.get(TeamsCRUDService)).toBeInstanceOf(TeamsCRUDService);
  });
});
