import { type Request, Response, NextFunction } from 'express'
import pinoHttp from 'pino-http'
import { logger } from './logger';

/**
 * @description
 * Logger instance for logging http requests
*/
const httpLogger = pinoHttp({
  logger: logger,
  customProps: (req: Request) => {
    try {
      const cookies = req.cookies;
      return { cookies };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(error);
      }
      return {};
    }
  },
});

export { httpLogger };