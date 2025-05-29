import { createTodo } from "./todo";
import { createProject } from "./project";
import { storage } from "./storage";

export class TodoApp {
  constructor() {
    this.projects = [];
    this.todos = [];
    this.currentProjectId = null;

    this.init();
  }
  init() {
    // Load projects and todos from storage
    this.loadFromStorage();
    // Create default project if no project exists
    if (this.projects.length === 0) {
      const defaultProject = createProject("Default Project");
      this.projects.push(defaultProject);
      this.currentProjectId = defaultProject.id;
      this.saveToStorage();
    }
  }

  loadFromStorage() {
    // Get all saved data from localStorage
    const data = storage.loadAll();

    this.projects = data.projects.map((projectData) => {
      const project = createProject(projectData.name);
      Object.assign(project, projectData);
      return project;
    });

    this.todos = data.todos.map((todoData) => {
      const todo = createTodo(
        todoData.title,
        todoData.description,
        todoData.dueDate,
        todoData.priority,
        todoData.projectId
      );
      Object.assign(todo, todoData);
      return todo;
    });

    this.currentProjectId = data.currentProject;

    if (this.currentProjectId && !this.getProject(this.currentProjectId)) {
      this.currentProjectId =
        this.projects.length > 0 ? this.projects[0].id : null;
    }
  }

  saveToStorage() {
    storage.saveAll(this.projects, this.todos, this.currentProjectId);
  }

  createProject(name) {
    const project = createProject(name);
    this.projects.push(project);
    this.saveToStorage();
    return project;
  }

  deleteProject(projectId) {
    // Check if we only have the default project
    if (this.projects.length <= 1) return false;

    // Remove all todos associated with the project
    const project = this.getProject(projectId);
    if (project) {
      project.todos.forEach((todoId) => {
        this.deleteTodo(todoId, false); // ADD: false parameter
      });
    }
    this.projects = this.projects.filter((p) => p.id !== projectId);

    // If we deleted the current project, switch to the first project
    if (this.currentProjectId === projectId) {
      this.currentProjectId = this.projects[0].id;
    }

    this.saveToStorage();
    return true;
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
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Todo methods

  createTodo(title, description, dueDate, priority = "medium") {
    const todo = createTodo(
      title,
      description,
      dueDate,
      priority,
      this.currentProjectId
    );
    this.todos.push(todo);

    // Add todo to current project
    const currentProject = this.getCurrentProject();
    if (currentProject) {
      currentProject.addTodo(todo.id);
    }
    this.saveToStorage();
    return todo;
  }

  deleteTodo(todoId, shouldSave = true) {
    // Remove from todos array
    this.todos = this.todos.filter((t) => t.id !== todoId);

    // Remove from all projects
    this.projects.forEach((project) => {
      project.removeTodo(todoId);
    });

    if (shouldSave) {
      this.saveToStorage();
    }
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
