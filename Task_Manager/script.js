const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

const category = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");

let tasks = [];

//WEEK 5: ADD TASK (ASYNC + EVENT LOOP + LOADING)
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const taskText = input.value.trim();
  if (!taskText) return;

  showLoading();

  setTimeout(() => {

    tasks.push({
      text: taskText,
      category: category.value,
      completed: false
    });

    hideLoading();
    showNotification("Task added!", "success");

    input.value = "";
    renderTasks();

  }, 500);
});


//WEEK 5: SEARCH + FILTER + DEBOUNCE
filterCategory.addEventListener("change", renderTasks);

function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

searchInput.addEventListener("input", debounce(renderTasks, 300));


//WEEK 4: RENDER TASKS (DOM MANIPULATION + STATE)
function renderTasks() {
  list.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = filterCategory.value;

  const filtered = tasks.filter(task =>
    task.text.toLowerCase().includes(searchValue) &&
    (selectedCategory === "all" || task.category === selectedCategory)
  );

  filtered.forEach(task => {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${task.text} [${task.category}]`;

    if (task.completed) {
      span.classList.add("completed");
    }

    //COMPLETE TASK (EVENT OBJECT + STATE UPDATE)
    span.addEventListener("click", function(event) {
      console.log(event.target);

      task.completed = !task.completed;
      showNotification("Task updated!", "success");
      renderTasks();
    });

    //EDIT TASK
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    editBtn.addEventListener("click", function() {
      const newText = prompt("Edit task:", task.text);

      if (newText !== null && newText.trim() !== "") {
        task.text = newText;
        showNotification("Task edited!", "success");
        renderTasks();
      }
    });

    //DELETE TASK (EVENT HANDLING)
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");

    deleteBtn.addEventListener("click", function(event) {
      console.log(event.target);

      tasks = tasks.filter(t => t !== task);
      showNotification("Task deleted!", "error");
      renderTasks();
    });


    //BUTTON GROUP (EDIT + DELETE SIDE BY SIDE)
    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btnGroup");

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);


    li.appendChild(span);
    li.appendChild(btnGroup);

    list.appendChild(li);
  });

  updateCounter();
}

//WEEK 3: STATE MANAGEMENT (COUNTER)
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  counter.textContent =
    `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}


//WEEK 5: NOTIFICATIONS (ASYNC UI FEEDBACK)
function showNotification(msg, type) {
  const div = document.createElement("div");
  div.classList.add("notification", type);
  div.textContent = msg;

  document.getElementById("notifications").appendChild(div);

  setTimeout(() => div.remove(), 2000);
}

//WEEK 5: LOADING STATE (ASYNC SIMULATION)
function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}