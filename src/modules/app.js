import { createTodo } from "./todo";
import { createProject } from "./project";

export class TodoApp {
  constructor() {
    this.projects = [];
    this.todos = [];
    this.currentProjectId = null;

    this.init();
  }
  init() {
    // Create default project if no project exists
    if (this.projects.length === 0) {
      const defaultProject = createProject("Default Project");
      this.projects.push(defaultProject);
      this.currentProjectId = defaultProject.id;
    }
  }

  createProject(name) {
    const project = createProject(name);
    this.projects.push(project);
    return project;
  }

  deleteProject(projectId) {
    // Check if we only have the default project
    if (this.projects.length <= 1) return false;

    // Remove all todos associated with the project
    const project = this.getProject(projectId);
    if (project) {
      project.todos.forEach((todoId) => {
        this.deleteTodo(todoId);
      });
    }
    this.projects = this.projects.filter((p) => p.id !== projectId);

    // If we deleted the current project, switch to the first project
    if (this.currentProjectId === projectId) {
      this.currentProjectId = this.projects[0].id;
    }
  }

  getProject(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }

  getCurrentProject() {
    return this.getProject(this.currentProjectId);
  }

  setCurrentProject(projectId) {
    if (this.getProject(projectId)) {
      this.currentProjectId = projectId;
      return true;
    }
    return false;
  }

  // Todo methods

  createTodo(title, description, dueDate, priority = "medium") {
    const todo = createTodo(title, description, dueDate, priority);
    this.todos.push(todo);

    // Add todo to current project
    const currentProject = this.getCurrentProject();
    if (currentProject) {
      currentProject.addTodo(todo.id);
    }
    return todo;
  }

  deleteTodo(todoId) {
    // Remove from todos array
    this.todos = this.todos.filter((t) => t.id !== todoId);

    // Remove from all projects
    this.projects.forEach((project) => {
      project.removeTodo(todoId);
    });
  }

  getTodo(todoId) {
    return this.todos.find((t) => t.id === todoId);
  }

  getTodosForProject(projectId) {
    const project = this.getProject(projectId);
    if (!project) return [];

    return project.todos.map((todoId) => this.getTodo(todoId)).filter(Boolean);
  }

  getCurrentTodos() {
    return this.getTodosForProject(this.currentProjectId);
  }
}
