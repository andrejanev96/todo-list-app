export function createProject(name) {
  return {
    id: generateId(),
    name,
    todos: [], // array of todo ids
    createdDate: new Date().toISOString(),

    // Methods to manage todos in this project
    addTodo(todoId) {
      if (!this.todos.includes(todoId)) {
        this.todos.push(todoId);
      }
    },

    removeTodo(todoId) {
      this.todos = this.todos.filter((id) => id !== todoId);
    },

    updateName(newName) {
      this.name = newName;
    },

    getTodoCount() {
      return this.todos.length;
    },
  };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
