// src/modules/dom.js
import { format, parseISO, isValid } from "date-fns";

export class DOMManager {
  constructor(app) {
    this.app = app;
    this.initializeElements();
    this.attachEventListeners();
    this.render();
  }

  initializeElements() {
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
      
      <!-- Modal containers -->
      <div id="todo-modal" class="modal hidden">
        <div class="modal-content">
          <span class="close">&times;</span>
          <div id="modal-body"></div>
        </div>
      </div>
    `;

    this.addTodoEventListeners();
  }

  renderTodoItem(todo) {
    const priorityClass = `priority-${todo.priority}`;
    const completedClass = todo.completed ? "completed" : "";

    // Format date using date-fns
    let formattedDate = todo.dueDate;
    if (todo.dueDate) {
      try {
        const date = parseISO(todo.dueDate);
        if (isValid(date)) {
          formattedDate = format(date, "MMM dd, yyyy");
        }
      } catch (error) {
        // Keep original date if parsing fails
      }
    }

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
              ${
                todo.dueDate
                  ? `<span class="todo-due-date">Due: ${formattedDate}</span>`
                  : ""
              }
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
      addProjectBtn.addEventListener("click", () => this.showAddProjectForm());
    }

    // Project selection
    const projectItems = document.querySelectorAll(".project-item");
    projectItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-project-btn")) {
          const projectId = item.dataset.projectId;
          this.app.setCurrentProject(projectId);
          this.render();
        }
      });
    });

    // Delete project buttons
    const deleteProjectBtns = document.querySelectorAll(".delete-project-btn");
    deleteProjectBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
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
      addTodoBtn.addEventListener("click", () => this.showAddTodoForm());
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

    // View Details buttons - NEW FUNCTIONALITY
    const expandBtns = document.querySelectorAll(".expand-todo-btn");
    expandBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const todoId = btn.dataset.todoId;
        this.showTodoDetails(todoId);
      });
    });

    // Modal close functionality
    const modal = document.getElementById("todo-modal");
    const closeBtn = modal?.querySelector(".close");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hideModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideModal();
        }
      });
    }
  }

  // NEW: Better project form
  showAddProjectForm() {
    this.showModal(`
      <h3>Add New Project</h3>
      <form id="add-project-form">
        <div class="form-group">
          <label for="project-name">Project Name:</label>
          <input type="text" id="project-name" required>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').querySelector('.close').click()">Cancel</button>
          <button type="submit" class="btn-primary">Create Project</button>
        </div>
      </form>
    `);

    const form = document.getElementById("add-project-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("project-name").value.trim();
      if (name) {
        this.app.createProject(name);
        this.hideModal();
        this.render();
      }
    });

    // Focus the input
    document.getElementById("project-name").focus();
  }

  // NEW: Better todo form
  showAddTodoForm() {
    const today = format(new Date(), "yyyy-MM-dd");

    this.showModal(`
      <h3>Add New Todo</h3>
      <form id="add-todo-form">
        <div class="form-group">
          <label for="todo-title">Title:</label>
          <input type="text" id="todo-title" required>
        </div>
        
        <div class="form-group">
          <label for="todo-description">Description:</label>
          <textarea id="todo-description" rows="3"></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="todo-due-date">Due Date:</label>
            <input type="date" id="todo-due-date" value="${today}">
          </div>
          
          <div class="form-group">
            <label for="todo-priority">Priority:</label>
            <select id="todo-priority">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="todo-tags">Tags (comma-separated):</label>
          <input type="text" id="todo-tags" placeholder="e.g. work, urgent, home">
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').querySelector('.close').click()">Cancel</button>
          <button type="submit" class="btn-primary">Create Todo</button>
        </div>
      </form>
    `);

    const form = document.getElementById("add-todo-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("todo-title").value.trim();
      const description = document
        .getElementById("todo-description")
        .value.trim();
      const dueDate = document.getElementById("todo-due-date").value;
      const priority = document.getElementById("todo-priority").value;
      const tagsInput = document.getElementById("todo-tags").value.trim();

      if (title) {
        const todo = this.app.createTodo(title, description, dueDate, priority);

        // Add tags if provided
        if (tagsInput) {
          const tags = tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
          tags.forEach((tag) => todo.addTag(tag));
          this.app.saveToStorage(); // Save tags
        }

        this.hideModal();
        this.render();
      }
    });

    document.getElementById("todo-title").focus();
  }

  // NEW: Todo details view
  showTodoDetails(todoId) {
    const todo = this.app.getTodo(todoId);
    if (!todo) return;

    // Format creation and due dates
    let createdDate = "Unknown";
    let dueDate = todo.dueDate || "No due date";

    try {
      if (todo.createdDate) {
        const created = parseISO(todo.createdDate);
        if (isValid(created)) {
          createdDate = format(created, "MMM dd, yyyy 'at' h:mm a");
        }
      }

      if (todo.dueDate) {
        const due = parseISO(todo.dueDate);
        if (isValid(due)) {
          dueDate = format(due, "MMM dd, yyyy");
        }
      }
    } catch (error) {
      // Keep default values if parsing fails
    }

    this.showModal(`
      <h3>${todo.title}</h3>
      <div class="todo-details">
        <div class="detail-section">
          <h4>Description</h4>
          <p>${todo.description || "No description provided"}</p>
        </div>
        
        <div class="detail-row">
          <div class="detail-section">
            <h4>Due Date</h4>
            <p>${dueDate}</p>
          </div>
          
          <div class="detail-section">
            <h4>Priority</h4>
            <p class="priority-${todo.priority}">${
      todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
    }</p>
          </div>
          
          <div class="detail-section">
            <h4>Status</h4>
            <p>${todo.completed ? "Completed" : "Pending"}</p>
          </div>
        </div>
        
        ${
          todo.tags.length > 0
            ? `
          <div class="detail-section">
            <h4>Tags</h4>
            <div class="tags-list">
              ${todo.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          todo.notes.length > 0
            ? `
          <div class="detail-section">
            <h4>Notes</h4>
            <ul class="notes-list">
              ${todo.notes.map((note) => `<li>${note}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        ${
          todo.checklist.length > 0
            ? `
          <div class="detail-section">
            <h4>Checklist</h4>
            <ul class="checklist">
              ${todo.checklist
                .map(
                  (item) => `
                <li class="${item.completed ? "completed" : ""}">
                  <input type="checkbox" ${
                    item.completed ? "checked" : ""
                  } data-item-id="${item.id}">
                  ${item.text}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <div class="detail-section">
          <h4>Created</h4>
          <p>${createdDate}</p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="this.closest('.modal').querySelector('.close').click()">Close</button>
          <button type="button" class="btn-primary" data-edit-todo="${todoId}">Edit Todo</button>
        </div>
      </div>
    `);

    // Add checklist item toggle functionality
    const checkboxes = document.querySelectorAll(
      '#todo-modal .checklist input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const itemId = e.target.dataset.itemId;
        todo.toggleChecklistItem(itemId);
        this.app.saveToStorage();
        // Re-render the modal content
        this.showTodoDetails(todoId);
      });
    });

    // Edit todo button (placeholder for now)
    const editBtn = document.querySelector("[data-edit-todo]");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        this.hideModal();
        // TODO: Implement edit functionality
        console.log("Edit todo:", todoId);
      });
    }
  }

  // NEW: Modal utilities
  showModal(content) {
    const modal = document.getElementById("todo-modal");
    const modalBody = document.getElementById("modal-body");

    if (modal && modalBody) {
      modalBody.innerHTML = content;
      modal.classList.remove("hidden");
    }
  }

  hideModal() {
    const modal = document.getElementById("todo-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  }
}
