import Storage from './storage.js';
import Project from './project.js';
import Todo from './todo.js';

export default class DOM {
  static init() {
    this.projects = Storage.loadProjects();
    this.activeProjectIndex = 0;
    this.renderLayout();
    this.renderProjects();
    this.renderTodos();
  }

  static renderLayout() {
    const app = document.querySelector('#app');
    app.innerHTML = `
      <div class="sidebar">
        <h2>Projects</h2>
        <div id="project-list"></div>
        <button id="add-project-btn">+ Add Project</button>
      </div>
      <div class="main">
        <h2 id="project-title"></h2>
        <div id="todo-list"></div>
        <button id="add-todo-btn">+ Add Todo</button>
      </div>
    `;

    document.querySelector('#add-project-btn').addEventListener('click', () => {
      const name = prompt('Project name:');
      if (name) {
        this.projects.push(new Project(name));
        Storage.saveProjects(this.projects);
        this.renderProjects();
      }
    });

    document.querySelector('#add-todo-btn').addEventListener('click', () => {
      const title = prompt('Todo title:');
      const desc = prompt('Description:');
      const due = prompt('Due date (YYYY-MM-DD):');
      const priority = prompt('Priority (low, medium, high):');

      if (title && due) {
        const todo = new Todo(title, desc, due, priority);
        this.projects[this.activeProjectIndex].addTodo(todo);
        Storage.saveProjects(this.projects);
        this.renderTodos();
      }
    });
  }

  static renderProjects() {
    const container = document.querySelector('#project-list');
    container.innerHTML = '';
    this.projects.forEach((p, index) => {
      const div = document.createElement('div');
      div.textContent = p.name;
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        this.activeProjectIndex = index;
        this.renderTodos();
      });
      container.appendChild(div);
    });
  }

  static renderTodos() {
    const container = document.querySelector('#todo-list');
    const project = this.projects[this.activeProjectIndex];
    document.querySelector('#project-title').textContent = project.name;
    container.innerHTML = '';

    project.todos.forEach((t, index) => {
      const div = document.createElement('div');
      div.classList.add('todo', `priority-${t.priority}`);
      div.innerHTML = `
        <strong>${t.title}</strong> - ${t.formattedDate()}<br>
        ${t.description || ''}<br>
        <button class="complete-btn">${t.completed ? 'Undo' : 'Complete'}</button>
        <button class="delete-btn">Delete</button>
      `;

      div.querySelector('.complete-btn').addEventListener('click', () => {
        t.toggleComplete();
        Storage.saveProjects(this.projects);
        this.renderTodos();
      });

      div.querySelector('.delete-btn').addEventListener('click', () => {
        project.deleteTodo(index);
        Storage.saveProjects(this.projects);
        this.renderTodos();
      });

      container.appendChild(div);
    });
  }
}
