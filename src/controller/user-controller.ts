import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";

const userService = new UserService();

export const getUserWithTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserWithTodos(parseInt(req.headers.authorization || '0'));
        res.send(user);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.deleteUser(parseInt(req.headers.authorization || '0'));
        res.status(200).send();
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body.name);
        res.status(201).send(user);
    } catch (error) {
        next(error);
    }
}