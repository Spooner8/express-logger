import passport from '../passport';
import { tokenService } from '../../utils/token';
import type { Request, Response } from 'express';
import type { User } from '../../../generated/prisma_client';
import { logger } from '../log/logger';
import { userService } from '../crud/user';
import db from '../database';
import type { JwtPayload } from 'jsonwebtoken';

const login = async (req: Request, res: Response) => {
    try {
        passport.authenticate('local', { session: false, failureRedirect: '/api/auth/login' }, async (error: unknown, user: User) => {
            if (error || !user) {
                logger.error({error}, 'Login failed');
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const { accessToken, refreshToken } = await generateTokens(user);

            tokenService.setTokenCookie('jwt', accessToken, res);
            tokenService.setTokenCookie('refreshToken', refreshToken, res);

            await tokenService.saveRefreshToken(user.id, refreshToken, req);
            await userService.updateUser(user.id, { ...user, lastLogin: new Date() });

            logger.info(`User ${user.email} logged in successfully`);
            return res.status(200).send({ message: 'User logged in' });
        })(req);
    }
    catch (error) {
        logger.error(error);
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        } else {
            return res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};

const logout = async (req: Request, res: Response) => {
    const user = await getCurrentUser(req);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
    await tokenService.expireToken(req, res);
    await tokenService.expireRefreshToken(req, res);
    logger.info(`User ${user.email} logged out successfully`);
    return res.status(200).json({ message: 'User logged out' });
};

async function getCurrentUser(req: Request) {
    try {
        const user: User | null = await new Promise<User | null>((resolve) => {
            passport.authenticate('jwt', { session: false }, (error: unknown, user: User) => {
                if (error || !user) {
                    return resolve(null);
                }
                resolve(user);
            })(req);
        });
        return user;
    } catch (error: unknown) {
        logger.error('Error getting current user', error);
        return null;
    }
}

async function generateTokens(user: User) {
    const accessToken = tokenService.generateAccessToken(user.id, user.email);
    const refreshToken = tokenService.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
}

async function refreshTokens(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }

    const payload = await tokenService.verifyRefreshToken(refreshToken, req) as JwtPayload;
    if (!payload.id) {
        return res.status(400).json({ message: 'Invalid token payload' });
    }
    
    const storedToken = await db.refreshToken.findFirst({
        where: {
            token: refreshToken,
        }
    });

    if (!storedToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }
    const user = await userService.getUserById(payload.id);

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    } else {
        const newAccessToken = tokenService.generateAccessToken(user.id, user.email);
        const newRefreshToken = tokenService.generateRefreshToken(user.id);

        tokenService.setTokenCookie('jwt', newAccessToken, res);
        tokenService.setTokenCookie('refreshToken', newRefreshToken, res);
        await tokenService.saveRefreshToken(user.id, newRefreshToken, req);
    }
    await tokenService.deleteRefreshToken(refreshToken);
    return res.status(200).json({ message: 'Tokens refreshed successfully' });
}

export const authService = {
    login,
    logout,
    getCurrentUser,
    refreshTokens,
    generateTokens,
};