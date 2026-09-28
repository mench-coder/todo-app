const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const clearCompleted = document.getElementById("clear-completed");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.replaceChildren();
  tasks.forEach((task, i) => {
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
      tasks.splice(i, 1);
      save();
      render();
    });

    li.addEventListener("click", () => {
      tasks[i].done = !tasks[i].done;
      save();
      render();
    });

    li.append(text, remove);
    list.appendChild(li);
  });
}

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
