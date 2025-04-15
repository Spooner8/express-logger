import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { authService } from '../services/auth/auth';
import db from '../services/database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION || '3600', 10);
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'thisisreallysecret';
const REFRESH_TOKEN_EXPIRATION = parseInt(process.env.REFRESH_TOKEN_EXPIRATION || '604800', 10); // 7 days

const generateAccessToken = (userId: string, username: string) => {
  const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  return token;
};

const generateRefreshToken = (userId: string): string => {
  const refreshToken = jwt.sign({ id: userId,  }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  return refreshToken;
};

const setTokenCookie = (name: string, token: string, res: Response) => {
  const maxAge = name === 'jwt' ? JWT_EXPIRATION * 1000 : REFRESH_TOKEN_EXPIRATION * 1000;
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

const verifyRefreshToken = async (token: string, req: Request) => {
  const tokenRecord = await db.refreshToken.findFirst({
    where: { token },
  });
  
  if (!tokenRecord) {
    return null;
  }
  
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  if (tokenRecord.ipAddress !== ipAddress || tokenRecord.userAgent !== userAgent) {
    return null;
  }
  
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

const saveRefreshToken = async (userId: string, refreshToken: string, req: Request) => {
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  await db.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION * 1000),
    },
  });
};

const expireToken = async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
};
  
const expireRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }
  
  res.cookie('refreshToken', '', { maxAge: 1, httpOnly: true });
  
  deleteRefreshToken(refreshToken);
}

const deleteRefreshToken = async (token: string) => {
  await db.refreshToken.deleteMany({
    where: {
      token,
    },
  });
}


export const tokenService = {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookie,
  verifyToken,
  verifyRefreshToken,
  saveRefreshToken,
  expireToken,
  expireRefreshToken,
  deleteRefreshToken,
};
