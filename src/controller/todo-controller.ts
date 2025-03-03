import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { createTodoValidator, statusUpdateValidator } from "../middleware/todoRequestValidator";
import { handleValidationErrors } from "../middleware/validationMiddleware";
import { TodoService } from "../service/todo-service";

export const todoRouter = Router();
const todoService = new TodoService();

todoRouter.route('/')
    .get(async (req: Request, res: Response) => {
        res.send(await todoService.getAllTodos(req.body.user));
    })
    .post(createTodoValidator, handleValidationErrors,  async (req: Request, res: Response) => {
        res.status(201).send(await todoService.createTodo(req.body, req.body.user));
    })

todoRouter.route('/:id')
    .get(param('id').isNumeric(), handleValidationErrors, async (req, res) => {
        const todo = await todoService.getTodoById(parseInt(req.params.id), req.body.user);
        if (todo) {
            res.status(200).send(todo);
        } else {
            res.status(404).send();
        }
    })
    .delete(param('id').isNumeric(), handleValidationErrors, async(req, res) => {
        if(await todoService.deleteTodo(parseInt(req.params.id), req.body.user)) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    })

todoRouter.route('/status/:id')
    .put(statusUpdateValidator, handleValidationErrors, async(req: Request, res: Response) => {
        if (await todoService.updateTodoStatus(parseInt(req.params.id), req.body.status, req.body.user)) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    })

todoRouter.route('/analytics/data')
    .get(async(req: Request, res: Response) => {
        res.send(await todoService.getTodoAnalytics(req.body.user));
    })