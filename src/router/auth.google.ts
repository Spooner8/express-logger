/**
 * @fileoverview  
 * This file contains the routes for authentication-related operations.  
 * It includes routes for login via Google  
 * 
 * Routes:  
 * - GET /api/auth/google/login: Redirects to Google for authentication.
 * - GET /api/auth/google/callback: Handles the callback from Google after authentication.
 */

import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { logger } from '../services/log/logger';
import { authGoogleService } from '../services/auth/auth.google';

const router = Router();

router.get('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        authGoogleService.login(req, res, next);
    } catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.get('/callback', async (req: Request, res: Response, next) => {
    try {
        authGoogleService.callback(req, res, next);
    } catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;