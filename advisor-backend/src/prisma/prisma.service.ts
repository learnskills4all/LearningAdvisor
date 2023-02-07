import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService is a wrapper around the PrismaClient.
 */

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Connect to the database when the module is initialized.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Shut down app on database disconnect.
   * @param app Nestjs application
   */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', this.beforeExit.bind(this, app));
  }

  /**
   * Close app on database disconnect.
   * @param app NestJS application
   */
  async beforeExit(app: INestApplication) {
    await app.close();
  }
}
