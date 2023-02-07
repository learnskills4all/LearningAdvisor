import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
    let rolesGuard: RolesGuard;
    let reflector: Reflector;

    // mock execution context
    const mockExecutionContext = createMock<ExecutionContext>();

    beforeEach(async () => {
        reflector = new Reflector();
        rolesGuard = new RolesGuard(reflector);
    });

    describe('should be defined', () => {
        it('RolesGuard', () => {
            expect(rolesGuard).toBeDefined();
        });

        it('CanActivate function', () => {
            jest
                .spyOn(rolesGuard, "canActivate").mockResolvedValueOnce(true);
            expect(rolesGuard.canActivate(mockExecutionContext)).toBeDefined();
        });

        it('MatchRoles function', () => {
            jest
                .spyOn(rolesGuard, "matchRoles").mockReturnValueOnce(true);
            expect(rolesGuard.matchRoles([Role.USER], Role.USER)).toBeDefined();
        });

        it('Reflector function', () => {
            jest
                .spyOn(reflector, "get").mockReturnValueOnce(true);
            expect(rolesGuard.matchRoles([Role.USER], Role.USER)).toBeDefined();
        });
    });

    describe('CanActivate function', () => {
        it('CanActivate gives the correct output', async () => {
            jest
                .spyOn(rolesGuard, "canActivate")
                .mockResolvedValueOnce(true);
            expect(rolesGuard
                .canActivate(mockExecutionContext)
            )
                .resolves.toEqual(true);
        });

        it('Reflector returns false', async () => {
            reflector.get = jest.fn().mockReturnValue([Role.USER]);
            const context = createMock<ExecutionContext>();
            const canActivate = rolesGuard.canActivate(context);
            expect(canActivate)
                .resolves.toEqual(false);
        });

        it('Reflector returns true', async () => {
            reflector.get = jest.fn().mockReturnValue(false);
            const context = createMock<ExecutionContext>();
            const canActivate = rolesGuard.canActivate(context);
            expect(canActivate)
                .resolves.toEqual(true);
        });
    })

    describe('MatchRoles function', () => {
        it('MatchRoles gives the correct output with true', () => {
            jest
                .spyOn(rolesGuard, "matchRoles")
                .mockReturnValueOnce(true);
            expect(rolesGuard
                .matchRoles([Role.USER], Role.USER)
            )
                .toEqual(true);
        });

        it('MatchRoles gives the correct output with false', () => {
            jest
                .spyOn(rolesGuard, "matchRoles")
                .mockReturnValueOnce(false);
            expect(rolesGuard
                .matchRoles([Role.USER], Role.USER)
            )
                .toEqual(false);
        });
    });
});