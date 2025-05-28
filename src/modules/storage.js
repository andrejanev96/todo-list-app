const STORAGE_KEYS = {
  PROJECTS: "todoApp_projects",
  TODOS: "todoApp_todos",
  CURRENT_PROJECT: "todoApp_currentProject",
};

export const storage = {
  // Save data to localStorage

  saveProjects(projects) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects:", error);
      return false;
    }
  },

  saveTodos(todos) {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos:", error);
      return false;
    }
  },

  saveCurrentProject(projectId) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, projectId);
    } catch (error) {
      console.error("Failed to save current project:", error);
      return false;
    }
  },

  // Load data from localStorage
  loadProjects() {
    // Get the JSON from localStorage
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      // If data exists, convert JSON string back to objects
      // If no data exists (first time user), return an empty array
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load projects:", error);
      return [];
    }
  },

  loadTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TODOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load todos:", error);
      return [];
    }
  },

  loadCurrentProject() {
    try {
      return localStorage.getItem(STORAGE_KEYS.TODOS);
    } catch (error) {
      console.error("Failed to load todos:", error);
      return [];
    }
  },

  saveAll(projects, todos, currentProjectId) {
    return (
      this.saveProjects(projects) &&
      this.saveTodos(todos) &&
      this.saveCurrentProject(currentProjectId)
    );
  },

  loadAll() {
    return {
      projects: this.loadProjects(),
      todos: this.loadTodos(),
      currentProject: this.loadCurrentProject(),
    };
  },

  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.TODOS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT);
    } catch (error) {
      console.error("Failed to clear storage:", error);
      return false;
    }
  },
};
