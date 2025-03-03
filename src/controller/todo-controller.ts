import { Request, Response, Router } from "express";
import { checkSchema, param, validationResult } from "express-validator";
import { datasource } from "../config/datasource";
import { Todo } from "../modal/todo";
import { redisClient } from "../config/redis";
import { logger } from "../config/logger";

export const router = Router();

const todoRepo = datasource.getRepository(Todo);

// Status validation
const statusList = ['PENDING', 'COMPLETED', 'NOT COMPLETED'];
const isValidStatusUpdate = (todo: Todo | null, id: number,  status: string): string => {
    if (!statusList.includes(status)) {
        logger.error('Invalid status received to update status => id:' + id + ' status:' + status)
        return 'Invalid status';
    }
    if (!todo) {
        logger.error('Invalid id received to update status => id:' + id + ' status:' + status)
        return 'Invalid id';
    }

    return '';
}

// Request validators
const createTodoValidator = checkSchema({
    title: { isString: true, errorMessage: 'Invalid title' },
    description: { isString: true, optional: true, errorMessage: 'Invalid description'},
    status: {isString: true, optional: true}
})
const statusUpdateValidator = checkSchema({
    id: { isNumeric: true, errorMessage: 'Id must be a number'},
    status: { isString: true, errorMessage: 'Status must be a string'}
})

export const getTodo = async (req: Request, res: Response) => {
    res.send(await todoRepo.find({ where: { user: req.body.user } }))
}
export const createTodo = async (req: Request, res: Response) => {
    logger.info("create request")
    const result = validationResult(req);

    if (result.isEmpty()) {
        const todo = new Todo();

        todo.title = req.body.title;
        todo.description = req.body.description || '';
        todo.deadline = req.body.deadline;

        todo.status = req.body.status || 'PENDING'
        todo.createdAt = new Date;
        todo.updatedAt = new Date;

        todo.user = req.body.user;
        res.status(201).send(await todoRepo.save(todo))
    } else {
        logger.error('Invalid request to create todo ' + result.array())
        res.status(400).send(result.array())
    }
}

router.route('/')
    // a route to get all todos
    .get(getTodo)
    // a route to create a todo
    .post(createTodoValidator, createTodo)

// a route to get todo by id
router.route('/:id')
    .get(param('id').isNumeric(), async (req, res) => {
        const cachedTodo = JSON.parse(await redisClient.get('todo-' + req.params.id) || '{}')
        if (cachedTodo.id) {
            if (cachedTodo.user.id !== req.body.user.id) {
                res.status(400).send();
                logger.error('Invalid user to get todo => id:' + req.params.id)
                return;
            }
            res.send(cachedTodo);
            return;
        }
        const todo = await todoRepo.findOne({ where: { id: parseInt(req.params.id) }})
        logger.info(JSON.stringify(todo))
        if (!todo) {
            res.status(400).send();
            logger.error('Invalid id received to find => id:' + req.params.id)
            return;
        }
        todo.user = req.body.user    
        redisClient.set('todo-' + req.params.id, JSON.stringify(todo));
        res.send(todo);
    })
    .delete(param('id').isNumeric(), async(req, res) => {
        const todo = await todoRepo.delete({ id: parseInt(req.params.id), user: req.body.user })
        redisClient.del('todo-' + req.params.id)
        if (!todo.affected) {
            res.status(400).send();
            logger.error('Invalid id received to delete => id:' + req.params.id)
            return;
        }
        res.status(200).send();
    })

// a route to update todo status by id
router.route('/status/:id')
    .put(statusUpdateValidator, async(req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            
            const todo = await todoRepo.findOne({ where: { id: parseInt(req.params.id), user: req.body.user } })
            const error = isValidStatusUpdate(todo, parseInt(req.params.id), req.body.status) 

            if (!todo || error) {
                res.status(400).send(error);
                return;
            }

            todo.status = req.body.status;
            todoRepo.save(todo);
            redisClient.set('todo-' + req.params.id, JSON.stringify(todo));
            res.status(200).send();
            return;
        } else {
            logger.error('Invalid request to update todo status ' + result.array())
            res.status(400).send(result.array())
        }
    })