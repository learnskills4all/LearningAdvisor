import { Injectable } from '@nestjs/common';

// Injectable decorator is used to define a class as a service
// NestJS injects dependencies into the class constructor
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
