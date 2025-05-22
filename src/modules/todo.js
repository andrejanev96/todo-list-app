export function createTodo(
  title,
  description,
  dueDate,
  priority = "medium",
  projectId = null
) {
  return {
    title,
    description,
    dueDate,
    priority,
    notes: [],
    checklist: [],
    completed: false,
    tags: [],
    id: generateId(),
    projectId,
    createdDate: new Date().toISOString(),

    toggleComplete() {
      this.completed = !this.completed;
    },

    updateTitle(newTitle) {
      this.title = newTitle;
    },

    updateDescription(newDescription) {
      this.description = newDescription;
    },

    updateDueDate(newDueDate) {
      this.dueDate = newDueDate;
    },

    updatePriority(newPriority) {
      this.priority = newPriority;
    },

    addNote(note) {
      this.notes.push(note);
    },

    removeNote(index) {
      this.notes.splice(index, 1);
    },

    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
    },
    removeTag(tag) {
      this.tags = this.tags.filter((t) => t !== tag);
    },

    addChecklistItem(item) {
      this.checklist.push({
        text: item,
        completed: false,
        id: generateId(),
      });
    },

    toggleChecklistItem(itemId) {
      const item = this.checklist.find((item) => item.id === itemId);
      if (item) {
        item.completed = !item.completed;
      }
    },
  };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
