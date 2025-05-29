// src/index.js
import "./style.css"; // Import our CSS file
import { TodoApp } from "./modules/app.js";
import { DOMManager } from "./modules/dom.js";

console.log("Todo List App Starting...");

// Initialize the application
const app = new TodoApp();
const domManager = new DOMManager(app);

console.log("App initialized with projects:", app.projects);
console.log("Current project:", app.getCurrentProject());

// For debugging - expose app to window so we can test in console
window.todoApp = app;
