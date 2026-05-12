// DOM Selection
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

const category = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");

let tasks = [];

// Add Task
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const taskText = input.value.trim();

  if (taskText === "") return;

  tasks.push({
    text: taskText,
    category: category.value,
    completed: false
  });

  input.value = "";
  renderTasks();
});

// FILTER + SEARCH EVENTS
filterCategory.addEventListener("change", renderTasks);
searchInput.addEventListener("input", renderTasks);

// Render Tasks
function renderTasks() {
  list.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = filterCategory.value;

  const filteredTasks = tasks.filter(function(task) {

    const matchSearch =
      task.text.toLowerCase().includes(searchValue);

    const matchCategory =
      selectedCategory === "all" ||
      task.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  filteredTasks.forEach(function(task, index) {

    const li = document.createElement("li");

    const span = document.createElement("span");

    span.textContent =
      task.text + " [" + task.category + "]";

    // COMPLETE TASK
    if (task.completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", function() {
      tasks[index].completed =
        !tasks[index].completed;

      renderTasks();
    });

    // EDIT TASK
    span.addEventListener("dblclick", function() {

      const newText = prompt(
        "Edit task:",
        task.text
      );

      if (newText !== null && newText.trim() !== "") {
        task.text = newText;
        renderTasks();
      }
    });

    // DELETE TASK
    const deleteBtn =
      document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function() {
      tasks.splice(index, 1);
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

  updateCounter();
}

// TASK COUNTER
function updateCounter() {

  const total = tasks.length;

  const completed =
    tasks.filter(task => task.completed).length;

  const pending = total - completed;

  counter.textContent =
    "Total: " + total +
    " | Completed: " + completed +
    " | Pending: " + pending;
}