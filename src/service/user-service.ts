import { datasource } from "../config/datasource";
import { logger } from "../config/logger";
import { ErrorMessage } from "../dto/error-message";
import { Todo } from "../modal/todo";
import { User } from "../modal/user";

const userRepo = datasource.getRepository(User);
const todoRepo = datasource.getRepository(Todo);

export class UserService {
    async createUser(name: string): Promise<User | ErrorMessage> {
        logger.info('Creating user: ' + name);
        return await userRepo.save({ name })
            .catch((error) => {
                if (error.code === 'ER_DUP_ENTRY') {
                    logger.error('User already exists with name: ' + name);
                    throw new ErrorMessage(400, 'User already exists');
                }
                throw error;
            });
    }

    async deleteUser(userId: number): Promise<void> {
        todoRepo.delete({ user: {id : userId} });
        const deleteResult = await userRepo.delete({ id: userId });
        if (deleteResult.affected) {
            logger.info('Deleted user => id: ' + userId);
        } else {
            logger.error('Error deleting user => id: ' + userId);
            throw new ErrorMessage(400, 'Error deleting user');
        }
    }

    async getUserWithTodos(userId: number): Promise<User | null> {
        logger.info('Getting user with todos => id: ' + userId);
        const user = await userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.todos', 'todo')
            .where('user.id = :userId', { userId })
            .getOne();
        if (!user) {
            logger.error('No user found => id: ' + userId);
            throw new ErrorMessage(400, 'No user found with id: ' + userId);
        }
        return user;
    }
}