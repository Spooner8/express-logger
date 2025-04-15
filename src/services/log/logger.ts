import type { Request } from 'express'
import pinoHttp from 'pino-http'
import pino from 'pino'
import { authService } from '../auth/auth';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

/**
 * @description
 * Logger instance for logging messages
 */
const logger = pino({
  level: LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

/**
 * @description
 * Logger instance for logging http requests
 */
const httpLogger = pinoHttp({
  logger: logger,
  customProps: async (req: Request) => {
    try {
      const user = await authService.getCurrentUser(req);
      return user ? { userId: user.id, username: user.email } : { userId: null, username: null };
    } catch (error) {
      logger.error(error);
      return { userId: null, username: null };
    }
  },
});

export { logger, httpLogger }