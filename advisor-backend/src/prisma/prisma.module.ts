import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Providers are responsible for executing business logic and returning data to the controller.
// Export the PrismaService to be used in the application
// Module for prisma related routes
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
