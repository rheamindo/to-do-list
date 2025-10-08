import Project from './project.js';
import Todo from './todo.js';

export default class Storage {
  static saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  static loadProjects() {
    const data = JSON.parse(localStorage.getItem('projects'));
    if (!data) return [new Project('Default')];

    return data.map((proj) => {
      const project = new Project(proj.name);
      proj.todos.forEach((t) => {
        const todo = new Todo(t.title, t.description, t.dueDate, t.priority);
        todo.completed = t.completed;
        project.addTodo(todo);
      });
      return project;
    });
  }
}
