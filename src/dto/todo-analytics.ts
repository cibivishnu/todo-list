import { Todo } from "../modal/todo";

export class TodoAnalytics {
    pendingTodos: number;
    completedTodos: number;
    inCompleteTodos: number;
    completionRate: number;

    todoWithNearestDeadline: Todo | null;
}