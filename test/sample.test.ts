import { expect, it } from '@jest/globals';
import { describe } from "node:test";
import { TodoService } from '../src/service/todo-service';
import { Todo } from '../src/modal/todo';


const fixedDate = new Date('2025-03-04T10:31:48.455Z');
beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
});

afterAll(() => {
    jest.useRealTimers();
});
const user = {
    id: 1,
    name: 'test',
    todos: []
}
const sampleTodo: Todo = {
    id: 1,
    title: 'Test todo',
    description: 'Test Description',
    status: 'PENDING',
    createdAt: fixedDate,
    updatedAt: fixedDate,
    deadline: fixedDate,
    user: user,
};
jest.mock("../src/config/datasource", () => {
    const fixedDate = new Date('2025-03-04T10:31:48.455Z');

    const user = {
        id: 1,
        name: 'test',
        todos: []
    }
    const sampleTodo: Todo = {
        id: 1,
        title: 'Test todo',
        description: 'Test Description',
        status: 'PENDING',
        createdAt: fixedDate,
        updatedAt: fixedDate,
        deadline: fixedDate,
        user: user,
    };
    const mockSave = jest.fn().mockResolvedValue(sampleTodo);
        return {
            datasource: {
                getRepository: jest.fn().mockReturnValueOnce({
                    save: mockSave,
                }),
            },
        };
    });
const todoService = new TodoService();

describe("Test to check if get todo is working fine", () => {
    jest.spyOn(todoService, 'getCachedTodo').mockResolvedValue(sampleTodo);
    it("Get todo", async () => {
        const result = await todoService.getTodoById(1, user)
        expect(todoService.getCachedTodo).toBeCalledWith(1);
        expect(todoService.getCachedTodo).toBeCalledTimes(1);
        expect(result).toEqual(sampleTodo);
    }, 20000);
});

describe("Test to check if create todo is working fine", () => {
    it("Create todo", async () => {
        const result = await todoService.createTodo(sampleTodo, user);
        expect(result).toEqual(sampleTodo);
    }, 20000);
});