import { Router } from 'express';
import { createUserValidator } from '../middleware/user-request-validator';
import { handleValidationErrors } from '../middleware/validation-middleware';
import { createUser, deleteUser, getUserWithTodos } from '../controller/user-controller';

export const router = Router();

router.route('/')
    .get(getUserWithTodos)
    .delete(deleteUser);

router.route('/signup')
    .post(createUserValidator, handleValidationErrors, createUser);