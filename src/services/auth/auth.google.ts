import passport from '../passport';
import { tokenService } from '../../utils/token';
import type { Request, Response, NextFunction} from 'express';
import { User } from '../../../generated/prisma_client';
import { logger } from '../log/logger';
import { userService } from '../crud/user';
import { authService } from './auth';

const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    } catch (err) {
        logger.error(err);
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        } else {
            return res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};

const callback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { failureRedirect: '/api/auth/login' }, async (err: unknown, user: User) => {
        if (err) {
            logger.error(err);
            return res.status(400).json({ message: 'Authentication failed' });
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        try {
            const { accessToken, refreshToken } = await authService.generateTokens(user);

            tokenService.setTokenCookie('jwt', accessToken, res);
            tokenService.setTokenCookie('refreshToken', refreshToken, res);

            await tokenService.saveRefreshToken(user.id, refreshToken, req);
            await userService.updateUser(user.id, { ...user, lastLogin: new Date() });

            logger.info(`User ${user.email} logged in successfully`);
            return res.status(200).send({ message: 'User logged in' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    })(req, res, next);
};

export const authGoogleService = {
    login,
    callback,
};