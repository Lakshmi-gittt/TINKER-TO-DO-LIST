let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTable() {
  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = "";

  const selectedMonth = document.getElementById("monthFilter").value;

  tasks.forEach((task, index) => {
    if (selectedMonth !== "All" && task.month !== selectedMonth) {
      return; // skip this task
    }

    const tr = document.createElement("tr");
 tr.innerHTML = `
  <td class="${task.completed ? 'completed' : ''}">${task.name}</td>
  <td>${task.date}</td>
  <td>${task.month}</td>
  <td>${task.by}</td>
  <td>${task.as}</td>
  <td>${task.priority}</td>
  <td>${task.completed ? '✅ Done' : '⏳ Pending'}</td>
  <td>
    <button onclick="moveUp(${index})">⬆️</button>
    <button onclick="moveDown(${index})">⬇️</button>
    <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Done'}</button>
    <button onclick="deleteTask(${index})">❌</button>
  </td>
`;

    tbody.appendChild(tr);
  });
}

function addTask(e) {
  e.preventDefault();

  const name = document.getElementById("taskName").value;
  const date = document.getElementById("taskDate").value;
  const month = document.getElementById("taskMonth").value;
  const by = document.getElementById("taskBy").value;
  const as = document.getElementById("taskAs").value;
  const priority = document.getElementById("taskPriority").value;

  tasks.push({ name, date, month, by, as, priority, completed: false });
  saveTasks();
  renderTable();

  document.getElementById("taskForm").reset();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTable();
}
function moveUp(index) {
  if (index > 0) {
    [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
    saveTasks();
    renderTable();
  }
}

function moveDown(index) {
  if (index < tasks.length - 1) {
    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    saveTasks();
    renderTable();
  }
}


function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTable();
}
function moveUp(index) {
  if (index > 0) {
    [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
    saveTasks();
    renderTable();
  }
}

function moveDown(index) {
  if (index < tasks.length - 1) {
    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    saveTasks();
    renderTable();
  }
}


document.getElementById("taskForm").addEventListener("submit", addTask);
renderTable();
