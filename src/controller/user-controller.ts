import { Request, Response, Router } from 'express';
import { User } from '../modal/user';
import { UserService } from '../service/user-service';
import { createUserValidator } from '../middleware/userRequestValidator';
import { handleValidationErrors } from '../middleware/validationMiddleware';

export const router = Router();
const userService = new UserService();

router.route('/')
    .get((req: Request, res: Response) => {
        res.send(req.body.user)
    })
    .delete(async(req: Request, res: Response) => {
        if (await userService.deleteUser(req.body.user)) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    })

router.route('/signup')
    .post(createUserValidator, handleValidationErrors, async(req: Request, res: Response) => {
        const user = await userService.createUser(req.body.name);
        if (user instanceof User) {
            res.status(201).send(user);
        } else {
            res.status(400).send(user);
        }
    })