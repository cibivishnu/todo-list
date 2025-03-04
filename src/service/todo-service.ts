import { log } from 'console';
import { datasource } from '../config/datasource';
import { logger } from '../config/logger';
import { redisClient } from '../config/redis';
import { ErrorMessage } from '../dto/error-message';
import { TodoAnalytics } from '../dto/todo-analytics';
import { Todo } from '../modal/todo';
import { User } from '../modal/user';

const todoRepo = datasource.getRepository(Todo);

export class TodoService {
    // to cache and retrieve a todo
    async cacheTodo(todo: Todo): Promise<void> {
        await redisClient.set('todo-' + todo.id, JSON.stringify(todo));
    }
    async getCachedTodo (id: number): Promise<Todo | undefined> {
        const cachedTodo = await redisClient.get('todo-' + id)
        return cachedTodo ? JSON.parse(cachedTodo) : undefined;
    }

    // to get all todos of a particular user
    async getAllTodos(user: User): Promise<Todo[]> {
        logger.info('Fetching all todos of user => id:' + user.id)
        return await todoRepo.find({ where: { user } }); 
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
        todo.user = user;
        this.cacheTodo(todo);
        return todo;
    }

    // to create a new todo
    async createTodo (todo: Todo, user: User): Promise<Todo> {
        logger.info('Creating todo')

        todo.status = todo.status || 'PENDING'
        todo.createdAt = new Date;
        todo.updatedAt = new Date;

        todo.user = user;
        log(todoRepo)
        return todoRepo.save(todo);
    }

    // delete a todo by id
    async deleteTodo (id: number, user: User): Promise<void> {
        const deleteResult = await todoRepo.delete({ id, user })
        if (deleteResult.affected) {
            redisClient.del('todo-' + id)
            logger.error('Deleted todo => id:' + id)
            return;
        }
        logger.error('Invalid id received to delete => id:' + id)
        throw new Error('Invalid id received to delete');
    }

    // update todo status by id
    async updateTodoStatus (id: number, status: string, user: User): Promise<void> {
        const todo = await this.getTodoById(id, user);
        if (!todo) {
            logger.error('Invalid id received to update status => id:' + id + ' status:' + status)
            throw new ErrorMessage(400, 'Invalid id received to update status');
        }
        todo.status = status;
        todoRepo.save(todo);
        this.cacheTodo(todo);
        logger.info('Updated todo status => id:' + id + ' status:' + status);
    }

    // get todo analytics
    async getTodoAnalytics (user: User): Promise<TodoAnalytics> {
        const pendingTodos = await todoRepo.count({ where: { user, status: 'PENDING' } });
        const completedTodos = await todoRepo.count({ where: { user, status: 'COMPLETED' } });
        const inCompleteTodos = await todoRepo.count({ where: { user, status: 'NOT COMPLETED' } });
        const completionRate = completedTodos / (completedTodos + inCompleteTodos + pendingTodos) * 100;
        const todoWithNearestDeadline = await todoRepo.findOne({ where:{ user, status: 'PENDING' }, order: { deadline: 'ASC' } });

        return { pendingTodos, completedTodos, inCompleteTodos, completionRate, todoWithNearestDeadline};
    }
}