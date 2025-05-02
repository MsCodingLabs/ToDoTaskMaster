// Elemente holen
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");
const taskCounter = document.querySelector("#taskCounter");
const themeSelect = document.querySelector("#themeSelect");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initialisieren
renderTasks();
updateCounter();
initTheme();

// Events
form.addEventListener("submit", addTask);
tasksList.addEventListener("click", handleTaskAction);
themeSelect.addEventListener("change", () => {
  setTheme(themeSelect.value);
  localStorage.setItem("theme", themeSelect.value);
});

// Aufgabe hinzufügen
function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    done: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

// Aufgabe erledigt/gelöscht
function handleTaskAction(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const li = btn.closest("li");
  const taskId = +li.dataset.id;

  if (btn.dataset.action === "delete") {
    tasks = tasks.filter((task) => task.id !== taskId);
  } else if (btn.dataset.action === "done") {
    const task = tasks.find((t) => t.id === taskId);
    task.done = !task.done;
  }

  saveTasks();
  renderTasks();
}

// Aufgaben anzeigen
function renderTasks() {
  tasksList.innerHTML = "";

  if (tasks.length === 0) {
    tasksList.append(emptyList);
    updateCounter();
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list-group-item task-item";
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.className = "task-title";
    if (task.done) span.classList.add("task-title--done");
    span.textContent = task.text;

    const btnGroup = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn-action";
    doneBtn.dataset.action = "done";
    doneBtn.innerHTML = `<img src="./img/tick.png" alt="✓" width="18" height="18"/>`;

    const delBtn = document.createElement("button");
    delBtn.className = "btn-action";
    delBtn.dataset.action = "delete";
    delBtn.innerHTML = `<img src="./img/cross.png" alt="✗" width="18" height="18"/>`;

    btnGroup.append(doneBtn, delBtn);
    li.append(span, btnGroup);
    tasksList.append(li);
  });

  updateCounter();
}

// Zähler aktualisieren
function updateCounter() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  taskCounter.textContent = `Tasks: ${total} | Done: ${done}`;
  emptyList.classList.toggle("none", total > 0);
}

// Speichern in localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Theme setzen
function setTheme(theme) {
  document.body.className = "";
  document.body.classList.add(`${theme}-mode`);
  themeSelect.value = theme;
}

// Theme initialisieren
function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
}

// Drag & Drop mit Sortable
new Sortable(tasksList, {
  animation: 150,
  onEnd: () => {
    const newOrder = Array.from(tasksList.children)
      .filter((li) => li.dataset.id)
      .map((li) => +li.dataset.id);

    tasks = newOrder.map((id) => tasks.find((t) => t.id === id));
    saveTasks();
  },
});
