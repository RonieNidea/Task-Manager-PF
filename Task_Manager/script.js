const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

const category = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");

const counter = document.getElementById("counter");
const loading = document.getElementById("loading");
const notifications = document.getElementById("notifications");

// WEEK 3 — APPLICATION STATE
let tasks = [];

// WEEK 5 — DEBOUNCE
function debounce(func, delay) {
  let timer;

  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

// WEEK 5 — NOTIFICATIONS
function showNotification(message, type) {
  const div = document.createElement("div");

  div.className = `notification ${type}`;
  div.textContent = message;

  notifications.appendChild(div);

  setTimeout(() => div.remove(), 2000);
}

// WEEK 5 — LOADING
function showLoading() {
  loading.style.display = "block";
}

function hideLoading() {
  loading.style.display = "none";
}

// WEEK 6 — FETCH API
async function loadCategories() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );

    const data = await response.json();

    console.log(data);

  } catch (error) {
    showNotification("API Error", "error");
  }
}

loadCategories();

// WEEK 4 — RENDER TASKS
function renderTasks() {

  list.innerHTML = "";

  const searchValue =
    searchInput.value.toLowerCase();

  const selectedCategory =
    filterCategory.value;

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchValue) &&
    (
      selectedCategory === "all" ||
      task.category === selectedCategory
    )
  );

  filteredTasks.forEach(task => {

    // TASK ITEM
    const li = document.createElement("li");

    // TASK TEXT
    const span = document.createElement("span");

    span.textContent =
      `${task.text} [${task.category}]`;

    if (task.completed) {
      span.classList.add("completed");
    }

    // COMPLETE TASK
    span.addEventListener("click", function (event) {

      console.log(event.target);

      task.completed = !task.completed;

      showNotification(
        "Task Updated",
        "success"
      );

      renderTasks();
    });

    // TIMER DISPLAY
    const timer = document.createElement("p");

    timer.textContent =
      `${task.time}s`;

    // TIMER FUNCTIONS
    let interval;

    function startTimer() {

      if (interval) return;

      interval = setInterval(() => {

        if (task.time > 0) {

          task.time--;

          timer.textContent =
            `${task.time}s`;

        } else {

          clearInterval(interval);

          showNotification(
            "Timer Finished",
            "success"
          );
        }

      }, 1000);
    }

    function pauseTimer() {
      clearInterval(interval);
      interval = null;
    }

    function resetTimer() {

      clearInterval(interval);

      interval = null;

      task.time = 100;

      timer.textContent =
        `${task.time}s`;
    }

    // START BUTTON
    const startBtn =
      document.createElement("button");

    startBtn.textContent = "Start";

    startBtn.addEventListener(
      "click",
      startTimer
    );

    // PAUSE BUTTON
    const pauseBtn =
      document.createElement("button");

    pauseBtn.textContent = "Pause";

    pauseBtn.addEventListener(
      "click",
      pauseTimer
    );

    // RESET BUTTON
    const resetBtn =
      document.createElement("button");

    resetBtn.textContent = "Reset";

    resetBtn.addEventListener(
      "click",
      resetTimer
    );

    // EDIT BUTTON
    const editBtn =
      document.createElement("button");

    editBtn.textContent = "Edit";

    editBtn.classList.add("editBtn");

    editBtn.addEventListener(
      "click",
      function () {

        const newText = prompt(
          "Edit task:",
          task.text
        );

        if (
          newText &&
          newText.trim() !== ""
        ) {

          task.text = newText;

          showNotification(
            "Task Edited",
            "success"
          );

          renderTasks();
        }
      }
    );

    // DELETE BUTTON
    const deleteBtn =
      document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.classList.add("deleteBtn");

    deleteBtn.addEventListener(
      "click",
      function (event) {

        console.log(event.target);

        tasks = tasks.filter(
          t => t !== task
        );

        showNotification(
          "Task Deleted",
          "error"
        );

        renderTasks();
      }
    );

    // BUTTON GROUP
    const btnGroup =
      document.createElement("div");

    btnGroup.classList.add("btnGroup");

    btnGroup.append(
      editBtn,
      deleteBtn,
      startBtn,
      pauseBtn,
      resetBtn
    );

    // APPEND
    li.append(
      span,
      timer,
      btnGroup
    );

    list.appendChild(li);
  });

  updateCounter();
}

// WEEK 3 — COUNTER
function updateCounter() {

  const total = tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const pending =
    total - completed;

  counter.textContent =
    `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}

// WEEK 3 + 5 — ADD TASK
form.addEventListener(
  "submit",
  async function (e) {

    e.preventDefault();

    const taskText =
      input.value.trim();

    if (!taskText) return;

    try {

      showLoading();

      await new Promise(resolve =>
        setTimeout(resolve, 500)
      );

      tasks.push({
        text: taskText,
        category: category.value,
        completed: false,
        time: 100
      });

      showNotification(
        "Task Added",
        "success"
      );

      input.value = "";

      renderTasks();

    } catch (error) {

      showNotification(
        "Something went wrong",
        "error"
      );

    } finally {

      hideLoading();
    }
  }
);

// WEEK 4 — FILTER
filterCategory.addEventListener(
  "change",
  renderTasks
);

// WEEK 5 — SEARCH
searchInput.addEventListener(
  "input",
  debounce(renderTasks, 300)
);