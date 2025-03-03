import { Router } from 'express';
import { User } from '../modal/user';
import { datasource } from '../config/datasource';
import { logger } from '../config/logger';

export const router = Router();
const userRepo = datasource.getRepository(User);

router.route('/')
    .get((req, res) => {
        res.send(req.body.user)
    })
    .delete(async(req, res) => {
        const user = await userRepo.delete({ id: req.body.user.id })
        if (user.affected) {
            res.status(400).send();
            logger.error('Invalid id received to delete user=> id:' + req.body.user.id)
            return;
        }
        res.status(200).send();
        
    })

router.post('/signup', async(req, res) => {
    const user = new User();
    user .name = req.body.name;
    res.send(await userRepo.save(user))
})