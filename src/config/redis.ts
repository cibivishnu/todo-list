import { createClient } from 'redis';
import { logger } from './logger';

export const redisClient = createClient({ url: 'redis://localhost:6379' })
redisClient.on('error', (error) => {
    logger.error('redis error: ' + error);
})