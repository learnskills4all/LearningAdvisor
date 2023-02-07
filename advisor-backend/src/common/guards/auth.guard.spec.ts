import { AuthGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let reflector: Reflector;

    // mock execution context
    const mockExecutionContext = createMock<ExecutionContext>();

    beforeEach(async () => {
        reflector = new Reflector();
        authGuard = new AuthGuard(reflector);
    });

    describe('should be defined', () => {
        it('AuthGuard', () => {
            expect(authGuard).toBeDefined();
        });

        it('CanActivate function', () => {
            jest
                .spyOn(authGuard, "canActivate")
                .mockReturnValueOnce(true);
            expect(authGuard.canActivate(mockExecutionContext)).toBeDefined();
        });
    });

    describe('CanActivate function', () => {
        it('Validate to true', () => {
            jest
                .spyOn(authGuard, "canActivate")
                .mockReturnValueOnce(true);
            expect(authGuard
                .canActivate(mockExecutionContext)
            )
                .toEqual(true);
        });

        it('Validate to false', () => {
            jest
                .spyOn(authGuard, "canActivate")
                .mockReturnValueOnce(false);
            expect(authGuard
                .canActivate(mockExecutionContext)
            )
                .toEqual(false);
        });

        it('Reflector returns true', () => {
            reflector.get = jest.fn().mockReturnValueOnce(true);
            const context = createMock<ExecutionContext>();
            const canActivate = authGuard.canActivate(context);
            expect(canActivate)
                .toBe(true);
        });
    });
});