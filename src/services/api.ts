import { type Express } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { limiter } from '../middleware/rate-limiter';
import { httpLogger, logger } from './log/logger';
import { prometheus } from '../middleware/prometheus';
import passport from './passport';

// Routers
import rolesRouter from '../router/roles';
import permissionsRouter from '../router/permissions';
import authRouter from '../router/auth';
import authGoogleRouter from '../router/auth.google';
import userRouter from '../router/user';

const PORT = process.env.API_PORT || 3000;
const LIMITER = (process.env.RATE_LIMITER || 'true') === 'true';
const RBAC = (process.env.RBAC || 'true') === 'true';
const USE_GOOGLE_AUTH = (process.env.USE_GOOGLE_AUTH || 'false') === 'true';

/**
 * @description
 * Initialize the API server
 * 
 * @param {Express} app - Express app
 */
export const initializeAPI = (app: Express) => {
    const allowedOrigins = ['http://localhost:80', 'http://localhost:3000'];

    const corsOptions = {
        origin: allowedOrigins,
        credentials: true,
    };

    app.set('trust proxy', 1);

    app.use(prometheus);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(httpLogger);
    app.use(passport.initialize());
    
    if (LIMITER) {
        app.use(limiter);
    }

    // Routers
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);

    if (RBAC) {
        app.use('/api/roles', rolesRouter);
        app.use('/api/permissions', permissionsRouter);
    }
    
    if(USE_GOOGLE_AUTH) {
        app.use('/api/auth/google', authGoogleRouter);
    }

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
};