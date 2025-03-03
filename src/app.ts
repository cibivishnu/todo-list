import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import { datasource } from './config/datasource';
import { router as todoRouter } from './controller/todo-controller';
import { logger } from './config/logger';
import { verifyUser } from './middleware/verifyUser';
import { router as userRouter } from './controller/user-controller';
import { redisClient } from './config/redis';

export const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(verifyUser)
app.use('/todo', todoRouter)
app.use('/user', userRouter)

datasource.initialize().then(() => {
    logger.info('db connected')
    redisClient.connect().then(() => {
        logger.info('redis connected')
        app.listen(PORT, () => {
            logger.info(`app listening on ${PORT}`)
        })   
    }).catch((() => {
        logger.error('connection to redis failed')
        logger.error('app not started')
    }))
}).catch(((err) => {
    logger.error('connection to mySQL failed. error: ', err)
    logger.error('app not started')
}))