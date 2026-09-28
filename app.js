const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter");
const clearCompleted = document.getElementById("clear-completed");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let filter = "all";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function tasksLeft() {
  return tasks.filter((task) => !task.done).length;
}

function visibleTasks() {
  if (filter === "active") return tasks.filter((task) => !task.done);
  if (filter === "done") return tasks.filter((task) => task.done);
  return tasks;
}

function render() {
  const left = tasksLeft();
  count.textContent = `${left} tasks left`;

  list.replaceChildren();
  visibleTasks().forEach((task) => {
    const li = document.createElement("li");
    li.classList.toggle("done", task.done);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      tasks = tasks.filter((item) => item !== task);
      save();
      render();
    });

    li.addEventListener("click", () => {
      task.done = !task.done;
      save();
      render();
    });

    li.append(text, remove);
    list.appendChild(li);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    render();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = "";
  save();
  render();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  save();
  render();
});

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

themeToggle.addEventListener("click", () => {
  const theme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", theme);
  applyTheme(theme);
});

applyTheme(localStorage.getItem("theme") || "light");
render();
