import { SetMetadata } from '@nestjs/common';

/**
 * Decorator used for authentication
 */
export const Unauthorized = () => SetMetadata('isUnauthorized', true);
