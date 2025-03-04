import { Router } from "express";
import { param } from "express-validator";
import { createTodoValidator, statusUpdateValidator } from "../middleware/todo-request-validator";
import { handleValidationErrors } from "../middleware/validation-middleware";
import { createTodo, deleteTodoById, getTodoAnalytics, getTodoById, getTodos, updateTodoStatus } from "../controller/todo-controller";

export const todoRouter = Router();

todoRouter.route('/')
    .get(getTodos)
    .post(createTodoValidator, handleValidationErrors, createTodo)

todoRouter.route('/:id')
    .get(param('id').isNumeric(), handleValidationErrors, getTodoById)
    .delete(param('id').isNumeric(), handleValidationErrors, deleteTodoById);

todoRouter.route('/status/:id')
    .put(statusUpdateValidator, handleValidationErrors, updateTodoStatus)

todoRouter.route('/analytics/data')
    .get(getTodoAnalytics)