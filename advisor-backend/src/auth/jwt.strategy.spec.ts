import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { aUser } from '../prisma/mock/mockUser';
import { userAuthentication } from '../prisma/mock/mockAuthService';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
    let prisma: PrismaService;
    let jwtStrategy: JwtStrategy;

    beforeEach(async () => {
        process.env = {
            DATABASE_URL: 'postgres://localhost:5432/test',
            JWT_SECRET: 'mycustomuselongsecret',
            EXPIRESIN: '60 days',
        };
        const module = await Test.createTestingModule({
            imports: [PassportModule],
            providers: [
                JwtStrategy,
                {
                    provide: PrismaService,
                    useValue: mockPrisma,
                },
            ],
        })
            .useMocker((token) => {
                if (token === JwtStrategy) {
                    return {
                        extractJwt: jest.fn().mockReturnValue(userAuthentication.token),
                    };
                }
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
        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('should be defined', () => {
        it('JwtStrategy', () => {
            expect(jwtStrategy).toBeDefined();
        });

        it('JwtStrategy validate function', async () => {
            expect(jwtStrategy.validate({ user_id: aUser.user_id })).toBeDefined();
        });
    });

    describe('Validate function', () => {
        it('Validate', async () => {
            expect(await jwtStrategy.validate({ user_id: aUser.user_id })).toEqual(
                aUser
            );
        });
    });
});
