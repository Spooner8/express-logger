import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { logger } from "../services/logger";
import { LogFn } from "pino";

const router = Router();

router.post('/', async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const { level, message, meta }: { level: keyof typeof logger; message: string; meta?: object } = req.body;

        if (logger[level]) {
            if (typeof logger[level] === 'function') {
                (logger[level] as LogFn)(meta || {}, message);
            } else {
                logger.info(meta || {}, message);
            }
        } else {
            logger.info(meta || {}, message);
        }
        next();
    }
    catch (error: unknown) {
        logger.error(error);
    }
});

export default router;
