# Todo List Application

A modern, feature-rich todo list application built with vanilla JavaScript and Webpack.

## Features

- ✅ Create and manage multiple projects
- ✅ Add, edit, and delete todos
- ✅ Priority levels with color coding
- ✅ Due dates with smart formatting
- ✅ Tags for better organization
- ✅ Notes and checklists for detailed planning
- ✅ Local storage persistence
- ✅ Responsive design
- ✅ Clean, modern UI

## Technologies Used

- **JavaScript (ES6+)** - Modern JavaScript with modules
- **Webpack** - Module bundling and development server
- **CSS3** - Modern styling with Grid and Flexbox
- **date-fns** - Date formatting and manipulation
- **Local Storage API** - Data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/andrejanev96/todo-list-app.git
cd todo-list-app
```

2. Install dependencies
   npm install

3. Start the development server:
   npm start

4. Open your browser and navigate to http://localhost:8080

## Building for Production

npm run build

## Project Structure

src/
├── modules/
│ ├── app.js # Main application logic
│ ├── dom.js # DOM manipulation
│ ├── project.js # Project factory
│ ├── storage.js # Local storage handling
│ └── todo.js # Todo factory
├── index.html # HTML template
├── index.js # Application entry point
└── style.css # Application styles

Usage

Creating Projects: Click the "+" button next to Projects to create a new project
Adding Todos: Click "+ Add Todo" to create a new todo with title, description, due date, and priority
Managing Todos: Use checkboxes to mark complete, "View Details" to see full information, or "Delete" to remove
Switching Projects: Click on any project in the sidebar to switch between them
Data Persistence: All data is automatically saved to your browser's local storage

Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is open source and available under the MIT License.
Acknowledgments

Built as part of The Odin Project curriculum
Inspired by modern todo applications like Todoist and Any.do
