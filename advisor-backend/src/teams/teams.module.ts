import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamsCRUDService } from './teams-crud.service';
import { TeamsCRUDController } from './teams-crud.controller';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
@Module({
  controllers: [TeamsController, TeamsCRUDController],
  providers: [TeamsService, TeamsCRUDService],
})
export class TeamsModule {}
