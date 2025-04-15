import { PrismaClient } from "../../generated/prisma_client";
import { logger } from './log/logger';

const db = new PrismaClient();

async function verifyDatabaseConnection() {
    try {
        await db.$connect();
        logger.info("Database connection established successfully.");
    } catch (error) {
        logger.error("Failed to connect to the database:", error);
        process.exit(1);
    }
}

verifyDatabaseConnection();

export default db