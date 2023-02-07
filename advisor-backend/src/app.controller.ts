import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Unauthorized } from './common/decorators/unauthorized.decorator';

// NestJS Controller class
// Controller decorator is used to define routes for the controller
// Get decorator is used to define GET routes
// ApiResponse decorator is used to define Swagger UI properties for this class
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiResponse({ status: 200, description: 'Hello World' })
  @Get()
  @Unauthorized()
  getHello(): string {
    return this.appService.getHello();
  }
}
