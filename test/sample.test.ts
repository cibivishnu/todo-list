import { expect, it } from '@jest/globals';
import { describe } from "node:test";
import { getTodo, createTodo } from '../src/controller/todo-controller';

jest.mock("../src/config/datasource", () => {
    const mockFind = jest.fn(() => []);
    const mockSave = jest.fn().mockResolvedValue({});
    const mockInitialize = jest.fn().mockResolvedValue({});
    return {
        datasource: {
            getRepository: jest.fn().mockReturnValue({
                find: mockFind,
                save: mockSave,
            }),
            initialize: mockInitialize,
        },
    };
});

describe("Test to check if get todo is working fine", () => {
    it("Get todo", async () => {
        // verify get togo method
        const req = {
            body: {
                user: {
                    id: 1,
                    name: 'test',
                    todos: []
                }
            }
        }
        const res = {
            send: jest.fn()
        }
        // mock the find method of todoRepo
        await getTodo(req as any, res as any)
        expect(res.send).toBeCalledWith([]);
    }, 20000);
});

describe("Test to check if create todo is working fine", () => {
    it("Create todo", async () => {
        // verify create todo method
        const req = {
            body: {
                title: 'Test Todo',
                description: 'Test Description',
                status: 'PENDING',
                user: {
                    id: 1,
                    name: 'test',
                    todos: []
                }
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        // mock the save method of todoRepo
        const todoRepo = {
            save: jest.fn().mockResolvedValue(req.body)
        }
        await createTodo(req as any, res as any)
        expect(res.status).toBeCalledWith(201);
    }, 20000);
});