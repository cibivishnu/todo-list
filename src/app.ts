import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import { datasource } from './config/datasource';
import { logger } from './config/logger';
import { redisClient } from './config/redis';
import { todoRouter } from './routes/todo-routes';
import { router as userRouter } from './routes/user-routes';
import { errorHandler } from './middleware/error-handler';
import { verifyUser } from './middleware/verify-user';

export const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use('/user', userRouter)

app.use(verifyUser)
app.use('/todo', todoRouter)

app.use(errorHandler)

datasource.initialize().then(() => {
    logger.info('db connected')
    app.listen(PORT, () => {
        logger.info(`app listening on ${PORT}`)
    })
    redisClient.connect().then(() => {
        logger.info('redis connected')
    }).catch((() => {
        logger.error('connection to redis failed')
    }))
}).catch(((err) => {
    logger.error('connection to mySQL failed. error: ', err)
    logger.error('app not started')
}))