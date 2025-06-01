document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const newTodoInput = document.getElementById('newTodoInput');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const todoList = document.getElementById('todoList');
  
  // Load saved todos
  loadTodos();
  
  // Add todo button click
  addTodoBtn.addEventListener('click', addTodo);
  
  // Enter key in input
  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  
  // Filter buttons
  document.getElementById('showAllBtn').addEventListener('click', () => showTodos('all'));
  document.getElementById('showActiveBtn').addEventListener('click', () => showTodos('active'));
  document.getElementById('showCompletedBtn').addEventListener('click', () => showTodos('completed'));
  document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);
  
  // Add a new todo
  function addTodo() {
    const text = newTodoInput.value.trim();
    
    // Don't add empty todos
    if (!text) return;
    
    // Create todo item
    createTodoItem(text);
    
    // Clear input
    newTodoInput.value = '';
    newTodoInput.focus();
    
    // Save todos
    saveTodos();
  }
  
  // Create todo element
  function createTodoItem(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (completed) li.classList.add('completed');
    
    li.innerHTML = `
      <input type="checkbox" class="complete-checkbox" ${completed ? 'checked' : ''}>
      <span class="todo-text">${text}</span>
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    `;
    
    todoList.appendChild(li);
    
    // Add event listeners to buttons
    const deleteBtn = li.querySelector('.delete-btn');
    const editBtn = li.querySelector('.edit-btn');
    const checkbox = li.querySelector('.complete-checkbox');
    
    deleteBtn.addEventListener('click', () => {
      li.remove();
      saveTodos();
    });
    
    editBtn.addEventListener('click', () => {
      const textSpan = li.querySelector('.todo-text');
      const currentText = textSpan.textContent;
      
      li.innerHTML = `
        <input type="checkbox" class="complete-checkbox" ${completed ? 'checked' : ''}>
        <input type="text" class="edit-input" value="${currentText}">
        <button class="save-btn">💾</button>
      `;
      
      const saveBtn = li.querySelector('.save-btn');
      const newCheckbox = li.querySelector('.complete-checkbox');
      const editInput = li.querySelector('.edit-input');
      
      editInput.focus();
      
      saveBtn.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText) {
          li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${newCheckbox.checked ? 'checked' : ''}>
            <span class="todo-text">${newText}</span>
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
          `;
          
          // Re-add event listeners
          const newDeleteBtn = li.querySelector('.delete-btn');
          const newEditBtn = li.querySelector('.edit-btn');
          const newCheckbox = li.querySelector('.complete-checkbox');
          
          newDeleteBtn.addEventListener('click', () => {
            li.remove();
            saveTodos();
          });
          
          newEditBtn.addEventListener('click', () => {
            const textSpan = li.querySelector('.todo-text');
            const currentText = textSpan.textContent;
            
            li.innerHTML = `
              <input type="checkbox" class="complete-checkbox" ${newCheckbox.checked ? 'checked' : ''}>
              <input type="text" class="edit-input" value="${currentText}">
              <button class="save-btn">💾</button>
            `;
            
            const saveBtn = li.querySelector('.save-btn');
            const editInput = li.querySelector('.edit-input');
            const checkbox = li.querySelector('.complete-checkbox');
            
            editInput.focus();
            
            saveBtn.addEventListener('click', () => {
              const newText = editInput.value.trim();
              if (newText) {
                li.innerHTML = `
                  <input type="checkbox" class="complete-checkbox" ${checkbox.checked ? 'checked' : ''}>
                  <span class="todo-text">${newText}</span>
                  <button class="edit-btn">✏️</button>
                  <button class="delete-btn">🗑️</button>
                `;
                
                // Re-add event listeners
                addTodoItemListeners(li);
                saveTodos();
              }
            });
          });
          
          newCheckbox.addEventListener('change', () => {
            li.classList.toggle('completed', newCheckbox.checked);
            saveTodos();
          });
          
          saveTodos();
        }
      });
    });
    
    checkbox.addEventListener('change', () => {
      li.classList.toggle('completed', checkbox.checked);
      saveTodos();
    });
  }
  
  // Save todos to browser storage
  function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
      const text = item.querySelector('.todo-text').textContent;
      const completed = item.classList.contains('completed');
      todos.push({ text, completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  
  // Load todos from browser storage
  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => {
      createTodoItem(todo.text, todo.completed);
    });
  }
  
  // Show todos based on filter
  function showTodos(filter) {
    const items = document.querySelectorAll('.todo-item');
    items.forEach(item => {
      switch(filter) {
        case 'all':
          item.style.display = 'flex';
          break;
        case 'active':
          item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
          break;
        case 'completed':
          item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
          break;
      }
    });
  }
  
  // Clear completed todos
  function clearCompleted() {
    document.querySelectorAll('.todo-item.completed').forEach(item => {
      item.remove();
    });
    saveTodos();
  }
});