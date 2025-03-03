import { NextFunction, Request, Response } from 'express';
import { datasource } from '../config/datasource';
import { User } from '../modal/user';
import { redisClient } from '../config/redis';

const userRepo = datasource.getRepository(User);
export const verifyUser = async(req: Request, res: Response, next: NextFunction) => {    
    if (req.originalUrl.includes('signup')) {
        next();
        return;
    }
    if (!req.headers.authorization) {
        res.status(401).send();
        return;
    }
    const cachedUser = await redisClient.get('user-' + req.headers.authorization)
    if (cachedUser) {
        req.body.user = JSON.parse(cachedUser);
        next();
        return;
    }
    const user = await userRepo.findOne({ where: { id: parseInt(req.headers.authorization || '0') }});
    if (user) {
        redisClient.set('user-' + req.headers.authorization, JSON.stringify(user));
        req.body.user = user;
        next();
    } else {
        res.status(401).send();
    }
}