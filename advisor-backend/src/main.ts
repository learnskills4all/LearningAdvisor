import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './prisma/prisma.service';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Defining the port to listen on
const PORT = process.env.PORT || 5000;

// Bootstrapping the application
async function bootstrap() {
  // Creating the NestJS application
  const app = await NestFactory.create(AppModule);
  // Adding the validation pipe to the application
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.setGlobalPrefix('api');
  // Adding the cookie parser to the application
  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    credentials: true,
    origin: true,
  });

  // Adding the authentication guard to the application
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  app.useGlobalGuards(new RolesGuard(reflector));

  // Setting up the configuration for the Swagger
  const config = new DocumentBuilder()
    .setTitle('TestING Advisor API')
    .setDescription('The TestING Advisor API description')
    .setVersion('1.0')
    .addTag('testadvisor')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Adding the Prisma service to the application
  app.useGlobalPipes(new ValidationPipe());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Listening on the port
  await app.listen(PORT);
}
// Bootstrapping the application
bootstrap();
