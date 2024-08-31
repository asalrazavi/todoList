// selecting
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todolist = document.querySelector(".todolist");
const todoCheck = document.querySelector(".todo__check");
const filterTodo = document.querySelector(".filter-todos");
// let todos = [];
let filterValue = "all";

//events
todoForm.addEventListener("submit", addNewTodo);
filterTodo.addEventListener("change", (e) => {
  filterValue = e.target.value;
  isComplete();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});

//functions
function addNewTodo(e) {
  e.preventDefault();

  if (!todoInput.value) return null;

  const newTodo = {
    id: Date.now(),
    createAt: new Date().toISOString(),
    title: todoInput.value,
    isComplete: false,
  };

  // todos.push(newTodo);
  saveTodos(newTodo);
  isComplete();
}

function createTodos(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
    <p class="todo__title ${todo.isComplete && "completed"}">${todo.title}</p>
    <span class="todo__createdAt">${new Date(todo.createAt).toLocaleDateString(
      "fa-IR"
    )}</span>
    <button class="todo__check" data-todo-id=${
      todo.id
    }><i class="far fa-check-square"></i></button>
    <button class="todo__remove" data-todo-id=${
      todo.id
    }><i class="far fa-trash-alt"></i></button>
    <button class="todo__edit" data-todo-id=${
      todo.id
    }><i class="far fa-edit"></i></button>
  </li>`;
  });

  todolist.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", editTodo));
}

function isComplete() {
  const todos = getAllTodos();
  let filteredTodos = [];

  if (filterValue === "completed") {
    filteredTodos = todos.filter((todo) => todo.isComplete);
  } else if (filterValue === "uncompleted") {
    filteredTodos = todos.filter((todo) => !todo.isComplete);
  } else {
    // Show all todos
    filteredTodos = todos;
  }
  createTodos(filteredTodos);
}

function removeTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  isComplete(todos);
}

function checkTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isComplete = !todo.isComplete;
  saveAllTodos(todos);
  isComplete(todos);
}

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos"))
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  return savedTodos;
}

function saveTodos(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//edit todo
let todoEditId = null;

function editTodo(e) {
  todoEditId = Number(e.target.dataset.todoId);
  let todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoEditId);

  document.getElementById("modalInput").value = todo.title;
  document.getElementById("editModal").style.display = "block";
}

// Close the modal
document.querySelector(".close").onclick = function () {
  document.getElementById("editModal").style.display = "none";
};

// Save changes
const saveEditedTodo = document.getElementById("saveEdit");

saveEditedTodo.addEventListener("click", () => {
  let todos = getAllTodos();
  const newTitle = document.getElementById("modalInput").value;

  if (newTitle.trim() !== "") {
    const todo = todos.find((t) => t.id === todoEditId);
    todo.title = newTitle.trim();
    saveAllTodos(todos);
    isComplete();
    document.getElementById("editModal").style.display = "none";
  }
});

// Close the modal if user clicks outside of it
window.onclick = function (event) {
  if (event.target === document.getElementById("editModal")) {
    document.getElementById("editModal").style.display = "none";
  }
};
