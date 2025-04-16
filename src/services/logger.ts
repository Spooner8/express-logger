import pino from 'pino'
import 'dotenv/config';

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

export { logger };