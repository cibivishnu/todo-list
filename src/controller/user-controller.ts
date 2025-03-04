import { Request, Response, Router, NextFunction } from 'express';
import { createUserValidator } from '../middleware/user-request-validator';
import { handleValidationErrors } from '../middleware/validation-middleware';
import { UserService } from '../service/user-service';

export const router = Router();
const userService = new UserService();

router.route('/')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.getUserWithTodos(parseInt(req.headers.authorization || '0'));
            res.send(user);
        } catch (error) {
            next(error);
        }
    })
    .delete(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.deleteUser(parseInt(req.headers.authorization || '0'));
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    });

router.route('/signup')
    .post(createUserValidator, handleValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.createUser(req.body.name);
            res.status(201).send(user);
        } catch (error) {
            next(error);
        }
    });