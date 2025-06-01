/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Todo List Application', () => {
  let document;
  let window;

  beforeEach(() => {
    // Load the HTML file into the JSDOM environment
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    document = new DOMParser().parseFromString(html, 'text/html');
    window = document.defaultView;

    // Assign global variables for window and document
    global.window = window;
    global.document = document;

    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    // Load the user's script
    require('../script.js');
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should add a new todo item to the list', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Learn Jest';
    addButton.click();
    const todoList = document.getElementById('todoList');
    expect(todoList.children.length).toBe(1);
    expect(todoList.children[0].textContent).toContain('Learn Jest');
  });

  test('should not add an empty todo item', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = '';
    addButton.click();
    const todoList = document.getElementById('todoList');
    expect(todoList.children.length).toBe(0);
  });

  test('should delete a todo item', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Task to delete';
    addButton.click();
    const deleteButton = document.querySelector('.delete-btn');
    deleteButton.click();
    const todoList = document.getElementById('todoList');
    expect(todoList.children.length).toBe(0);
  });

  test('should mark a todo item as completed', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Complete this task';
    addButton.click();
    const checkbox = document.querySelector('.complete-checkbox');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    const todoItem = document.querySelector('.todo-item');
    expect(todoItem.classList.contains('completed')).toBe(true);
  });

  test('should edit a todo item', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Initial Task';
    addButton.click();
    const editButton = document.querySelector('.edit-btn');
    editButton.click();
    const editInput = document.querySelector('.edit-input');
    editInput.value = 'Updated Task';
    const saveButton = document.querySelector('.save-btn');
    saveButton.click();
    const todoItem = document.querySelector('.todo-item');
    expect(todoItem.textContent).toContain('Updated Task');
  });

  test('should persist todos in localStorage', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Persisted Task';
    addButton.click();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test('should load todos from localStorage on page load', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([{ text: 'Loaded Task', completed: false }]));
    jest.resetModules();
    require('../script.js');
    const todoList = document.getElementById('todoList');
    expect(todoList.children.length).toBe(1);
    expect(todoList.children[0].textContent).toContain('Loaded Task');
  });

  test('should sanitize input to prevent XSS', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = '<script>alert("XSS")</script>';
    addButton.click();
    const todoItem = document.querySelector('.todo-item');
    expect(todoItem.innerHTML).not.toContain('<script>');
  });

  test('should filter to show only active tasks', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Active Task';
    addButton.click();
    const completedInput = document.getElementById('newTodoInput');
    completedInput.value = 'Completed Task';
    addButton.click();
    const checkboxes = document.querySelectorAll('.complete-checkbox');
    checkboxes[1].checked = true;
    checkboxes[1].dispatchEvent(new Event('change'));
    const showActiveBtn = document.getElementById('showActiveBtn');
    showActiveBtn.click();
    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Active Task');
  });

  test('should filter to show only completed tasks', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Active Task';
    addButton.click();
    const completedInput = document.getElementById('newTodoInput');
    completedInput.value = 'Completed Task';
    addButton.click();
    const checkboxes = document.querySelectorAll('.complete-checkbox');
    checkboxes[1].checked = true;
    checkboxes[1].dispatchEvent(new Event('change'));
    const showCompletedBtn = document.getElementById('showCompletedBtn');
    showCompletedBtn.click();
    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Completed Task');
  });

  test('should clear all completed tasks', () => {
    const input = document.getElementById('newTodoInput');
    const addButton = document.getElementById('addTodoBtn');
    input.value = 'Task 1';
    addButton.click();
    input.value = 'Task 2';
    addButton.click();
    const checkboxes = document.querySelectorAll('.complete-checkbox');
    checkboxes[0].checked = true;
    checkboxes[0].dispatchEvent(new Event('change'));
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    clearCompletedBtn.click();
    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Task 2');
  });
});
