const container = document.querySelector(".container");
const inputField = document.querySelector("#newTodoInput");
const addBtn = document.querySelector("#addTodoBtn");
const todoList = document.querySelector("#todoList");

const showAllBtn = document.getElementById("showAllBtn");
const showActiveBtn = document.getElementById("showActiveBtn");
const showCompletedBtn = document.getElementById("showCompletedBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveData() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(filter = "all") {
  todoList.innerHTML = "";
  let filterTodos = todos;

  if (filter === "active") {
    filterTodos = todos.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    filterTodos = todos.filter((todo) => todo.completed);
  }
  if (filterTodos.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.textContent = "📭 No todos found!";
    emptyMsg.className = "empty-state";
    todoList.appendChild(emptyMsg);
    return;
  }
  filterTodos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";
    const checkDiv = document.createElement('div')
    checkDiv.className = 'right-div'
    if (todo.completed) todoItem.classList.add("completed");

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "complete-checkbox";
    checkBox.checked = todo.completed;
    checkBox.addEventListener("change", () => {
      todo.completed = checkBox.checked;
      saveData();
      renderTodos(filter);
    });

    const textWrapper = document.createElement('div')
    textWrapper.className = 'text-wrapper'

    const textSpan = document.createElement("p");
    textSpan.textContent = todo.text;
    textSpan.className = "todo-text";

    const timeSpan = document.createElement("span");
    const date = new Date(todo.createdAt);
    timeSpan.textContent = `Created ${date.toLocaleString([],{dateStyle:'short',timeStyle:'short'})}`;

    const toolContainer  =document.createElement('div')
    toolContainer.className = 'tool-container'
    
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => {
      if (editBtn.textContent === "✏️") {
        const input = document.createElement("input");
        input.type = "text";
        input.value = textSpan.textContent;
        input.className = "edit-input";
        textSpan.textContent = "";
        textSpan.appendChild(input);
        input.focus();
        editBtn.textContent = "🗃️";
      } else {
        const input = textSpan.querySelector("input");
        if (input.value.trim() !== "") {
          todo.text = input.value;
          saveData();
          renderTodos(filter);
        }
      }
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      saveData();
      renderTodos(filter);
    });
    checkDiv.append(checkBox,textWrapper);
    todoItem.appendChild(checkDiv);
    textWrapper.append(textSpan,timeSpan)
    toolContainer.append(editBtn,delBtn)
    todoItem.appendChild(toolContainer);
    todoList.appendChild(todoItem);
  });
}
addBtn.addEventListener("click", () => {
  const value = inputField.value.trim();
  if (value === "") {
    alert("Please enter some thing");
    return;
  }
  todos.unshift({
    text: value,
    completed: false,
    createdAt: new Date().toISOString(),
  });
  inputField.value = "";
  saveData();
  renderTodos();
});

function setActiveFilterButton(activeBtn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

showAllBtn.addEventListener("click", () => {
  renderTodos("all");
  setActiveFilterButton(showAllBtn);
});
showActiveBtn.addEventListener("click", () => {
  renderTodos("active");
  setActiveFilterButton(showActiveBtn);
});
showCompletedBtn.addEventListener("click", () => {
  renderTodos("completed");
  setActiveFilterButton(showCompletedBtn);
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveData();
  renderTodos();
});
renderTodos();
