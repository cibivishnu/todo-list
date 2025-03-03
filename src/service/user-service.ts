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
        return await userRepo.save({ name }).catch((error) => {
            if (error.code === 'ER_DUP_ENTRY') {
                logger.error('User already exists with name: ' + name);
                return new ErrorMessage(400, 'User already exists');
            }
            throw error;
        });
    }

    async deleteUser(user: User): Promise<boolean> {
        todoRepo.delete({ user });
        const deleteResult = await userRepo.delete({ id: user.id });
        if (deleteResult.affected) {
            logger.info('Deleted user => id: ' + user.id);
            return true;
        } else {
            logger.error('Error deleting user => id: ' + user.id);
            return false;
        }
    }
}