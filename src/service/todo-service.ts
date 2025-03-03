import { datasource } from '../config/datasource';
import { logger } from '../config/logger';
import { redisClient } from '../config/redis';
import { Todo } from '../modal/todo';
import { User } from '../modal/user';

const todoRepo = datasource.getRepository(Todo);

export class TodoService {
    // to cache and retrieve a todo
    async cacheTodo (todo: Todo): Promise<void> {
        await redisClient.set('todo-' + todo.id, JSON.stringify(todo));
    }
    async getCachedTodo (id: number): Promise<Todo | undefined> {
        const cachedTodo = await redisClient.get('todo-' + id)
        return cachedTodo ? JSON.parse(cachedTodo) : undefined;
    }

    // to get all todos of a particular user
    async getAllTodos(user: User): Promise<Todo[]> {
        return await todoRepo.find({ where: { user } })
    }

    // to get a todo by id
    async getTodoById (id: number, user: User): Promise<Todo | undefined> {
        const cachedTodo = await this.getCachedTodo(id);
        if (cachedTodo) {
            if (cachedTodo.user.id !== user.id) {
                return undefined;
            }
            return cachedTodo;
        }
        const todo = await todoRepo.findOne({ where: { id, user}})
        if (!todo) {
            return undefined;
        }
        this.cacheTodo(todo);
        return todo;
    }

    // to create a new todo
    // TODO
    async createTodo (todo: Todo, user: User): Promise<Todo> {
        logger.info('Creating todo')

        todo.status = todo.status || 'PENDING'
        todo.createdAt = new Date;
        todo.updatedAt = new Date;

        todo.user = user;
        return await todoRepo.save(todo);
    }

    // delete a todo by id
    async deleteTodo (id: number, user: User): Promise<boolean> {
        const deleteResult = await todoRepo.delete({ id, user })
        if (deleteResult.affected) {
            redisClient.del('todo-' + id)
            logger.error('Deleted todo => id:' + id)
            return true;
        }
        logger.error('Invalid id received to delete => id:' + id)
        return false;
    }

    // update todo status by id
    async updateTodoStatus (id: number, status: string, user: User): Promise<boolean> {
        const todo = await this.getTodoById(id, user);
        if (!todo) {
            logger.error('Invalid id received to update status => id:' + id + ' status:' + status)
            return false;
        }
        todo.status = status;
        todoRepo.save(todo);
        this.cacheTodo(todo);
        logger.info('Updated todo status => id:' + id + ' status:' + status);
        return true;
    }
}