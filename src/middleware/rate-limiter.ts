import { rateLimit } from 'express-rate-limit'

/**
 * @description
 * Middleware to rate limit requests.
 * WindowMs is set to 15 minutes and limit is set to 100 requests.
 * 
 * @see https://www.npmjs.com/package/express-rate-limit
 * 
 * @example app.use(limiter)
 */
export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 500,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})