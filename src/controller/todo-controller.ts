import { NextFunction, Request, Response } from "express";
import { TodoService } from "../service/todo-service";

const todoService = new TodoService();

export const getTodos = async (req: Request, res: Response) => {
    res.send(await todoService.getAllTodos(req.body.user));
}

export const createTodo = async (req: Request, res: Response) => {
    res.status(201).send(await todoService.createTodo(req.body, req.body.user));
}

export const getTodoById = async (req: Request, res: Response) => {
    const todo = await todoService.getTodoById(parseInt(req.params.id), req.body.user);
    if (todo) {
        res.status(200).send(todo);
    } else {
        res.status(404).send();
    }
}

export const deleteTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await todoService.deleteTodo(parseInt(req.params.id), req.body.user);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
}

export const updateTodoStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await todoService.updateTodoStatus(parseInt(req.params.id), req.body.status, req.body.user);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
}

export const getTodoAnalytics = async (req: Request, res: Response) => {
    res.send(await todoService.getTodoAnalytics(req.body.user));
}