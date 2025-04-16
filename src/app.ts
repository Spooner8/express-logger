import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import { logger } from './services/logger';
import { httpLogger } from './services/httpLogger';
import loggerRouter from './router/logger'

const LOG_PORT = process.env.LOG_PORT || 3001;
const SERVER_ROLE = process.env.SERVER_ROLE || 'all';

const app = express();
const allowedOrigins = ['http://localhost:80', 'http://localhost:3000'];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

switch (SERVER_ROLE) {
    case 'status':
        app.use('/api/log', loggerRouter);
        break;
    case 'http':
        app.use(httpLogger);
        break;
    case 'all':
        app.use(httpLogger);
        app.use('/api/log', loggerRouter);
        break;
    default:
        console.error(`Invalid SERVER_ROLE: ${SERVER_ROLE}`);
        process.exit(1);
}

app.listen(LOG_PORT, () => {
    logger.info(`Logger-Server is running on port ${LOG_PORT} and with role ${SERVER_ROLE}`);
});
