const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter");

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

  list.innerHTML = "";
  visibleTasks().forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.classList.toggle("done", task.done);
    li.addEventListener("click", () => {
      task.done = !task.done;
      save();
      render();
    });
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

render();
