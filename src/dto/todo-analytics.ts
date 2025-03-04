import { Todo } from "../modal/todo";

export class TodoAnalytics {
    pendingTodos: number;
    completedTodos: number;
    inCompleteTodos: number;
    completionRate: number;

    averageCompletionTime: number;
    overdueTodos: number;
    todosCreatedLast7Days: number;
    todosCompletedLast7Days: number;
    
    todoWithNearestDeadline: Todo | null;
}