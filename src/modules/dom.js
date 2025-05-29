// src/modules/dom.js

export class DOMManager {
  constructor(app) {
    this.app = app; // Reference to our TodoApp instance
    this.initializeElements();
    this.attachEventListeners();
    this.render();
  }

  initializeElements() {
    // Get references to main DOM elements
    this.sidebar = document.getElementById("sidebar");
    this.mainContent = document.getElementById("main-content");
  }

  attachEventListeners() {
    // We'll add event listeners here
  }

  render() {
    this.renderSidebar();
    this.renderMainContent();
  }

  renderSidebar() {
    const projects = this.app.projects;
    const currentProjectId = this.app.currentProjectId;

    this.sidebar.innerHTML = `
      <div class="projects-section">
        <div class="section-header">
          <h3>Projects</h3>
          <button id="add-project-btn" class="btn-icon">+</button>
        </div>
        <div class="projects-list">
          ${projects
            .map(
              (project) => `
            <div class="project-item ${
              project.id === currentProjectId ? "active" : ""
            }" 
                 data-project-id="${project.id}">
              <span class="project-name">${project.name}</span>
              <span class="todo-count">${project.getTodoCount()}</span>
              ${
                projects.length > 1
                  ? `<button class="delete-project-btn" data-project-id="${project.id}">×</button>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    // Add event listeners for project items
    this.addProjectEventListeners();
  }

  renderMainContent() {
    const currentProject = this.app.getCurrentProject();
    const todos = this.app.getCurrentTodos();

    if (!currentProject) {
      this.mainContent.innerHTML = "<p>No project selected</p>";
      return;
    }

    this.mainContent.innerHTML = `
      <div class="main-header">
        <h2>${currentProject.name}</h2>
        <button id="add-todo-btn" class="btn-primary">+ Add Todo</button>
      </div>
      <div class="todos-container">
        ${
          todos.length === 0
            ? '<p class="no-todos">No todos yet. Create your first todo!</p>'
            : todos.map((todo) => this.renderTodoItem(todo)).join("")
        }
      </div>
    `;

    // Add event listeners for todos
    this.addTodoEventListeners();
  }

  renderTodoItem(todo) {
    const priorityClass = `priority-${todo.priority}`;
    const completedClass = todo.completed ? "completed" : "";

    return `
      <div class="todo-item ${priorityClass} ${completedClass}" data-todo-id="${
      todo.id
    }">
        <div class="todo-main">
          <input type="checkbox" class="todo-checkbox" ${
            todo.completed ? "checked" : ""
          }>
          <div class="todo-content">
            <h4 class="todo-title">${todo.title}</h4>
            <p class="todo-description">${todo.description}</p>
            <div class="todo-meta">
              <span class="todo-due-date">Due: ${todo.dueDate}</span>
              <span class="todo-priority">Priority: ${todo.priority}</span>
              ${
                todo.tags.length > 0
                  ? `
                <div class="todo-tags">
                  ${todo.tags
                    .map((tag) => `<span class="tag">${tag}</span>`)
                    .join("")}
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="expand-todo-btn" data-todo-id="${
            todo.id
          }">View Details</button>
          <button class="delete-todo-btn" data-todo-id="${
            todo.id
          }">Delete</button>
        </div>
      </div>
    `;
  }

  addProjectEventListeners() {
    // Add project button
    const addProjectBtn = document.getElementById("add-project-btn");
    if (addProjectBtn) {
      addProjectBtn.addEventListener("click", () => this.showAddProjectModal());
    }

    // Project selection
    const projectItems = document.querySelectorAll(".project-item");
    projectItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-project-btn")) {
          const projectId = item.dataset.projectId;
          this.app.setCurrentProject(projectId);
          this.render(); // Re-render to show new selection
        }
      });
    });

    // Delete project buttons
    const deleteProjectBtns = document.querySelectorAll(".delete-project-btn");
    deleteProjectBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent project selection
        const projectId = btn.dataset.projectId;
        if (
          confirm(
            "Are you sure you want to delete this project and all its todos?"
          )
        ) {
          this.app.deleteProject(projectId);
          this.render();
        }
      });
    });
  }

  addTodoEventListeners() {
    // Add todo button
    const addTodoBtn = document.getElementById("add-todo-btn");
    if (addTodoBtn) {
      addTodoBtn.addEventListener("click", () => this.showAddTodoModal());
    }

    // Todo checkboxes
    const todoCheckboxes = document.querySelectorAll(".todo-checkbox");
    todoCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const todoId = e.target.closest(".todo-item").dataset.todoId;
        const todo = this.app.getTodo(todoId);
        if (todo) {
          todo.toggleComplete();
          this.app.saveToStorage();
          this.render();
        }
      });
    });

    // Delete todo buttons
    const deleteTodoBtns = document.querySelectorAll(".delete-todo-btn");
    deleteTodoBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const todoId = btn.dataset.todoId;
        if (confirm("Are you sure you want to delete this todo?")) {
          this.app.deleteTodo(todoId);
          this.render();
        }
      });
    });

    // Expand todo buttons (we'll implement this later)
    const expandBtns = document.querySelectorAll(".expand-todo-btn");
    expandBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const todoId = btn.dataset.todoId;
        console.log("Expand todo:", todoId); // Placeholder for now
      });
    });
  }

  showAddProjectModal() {
    const name = prompt("Enter project name:");
    if (name && name.trim()) {
      this.app.createProject(name.trim());
      this.render();
    }
  }

  showAddTodoModal() {
    // Simple modal for now - we can make this fancier later
    const title = prompt("Todo title:");
    if (!title || !title.trim()) return;

    const description = prompt("Description:") || "";
    const dueDate = prompt("Due date (YYYY-MM-DD):") || "";
    const priority = prompt("Priority (low/medium/high):") || "medium";

    this.app.createTodo(title.trim(), description.trim(), dueDate, priority);
    this.render();
  }
}
