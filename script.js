let tasks = [];

window.onload = async function () {
  const { collection, getDocs } = window.firebaseFuncs;
  const querySnapshot = await getDocs(collection(window.db, "tasks"));
  tasks = [];
  querySnapshot.forEach((docSnap) => {
    tasks.push({ id: docSnap.id, ...docSnap.data() });
  });
  renderTable();
};

function renderTable() {
  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = "";

  const selectedMonth = document.getElementById("monthFilter").value;

  tasks.forEach((task, index) => {
    if (selectedMonth !== "All" && task.month !== selectedMonth) return;

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

async function addTask(e) {
  e.preventDefault();

  const name = document.getElementById("taskName").value;
  const date = document.getElementById("taskDate").value;
  const month = document.getElementById("taskMonth").value;
  const by = document.getElementById("taskBy").value;
  const as = document.getElementById("taskAs").value;
  const priority = document.getElementById("taskPriority").value;

  const { addDoc, collection } = window.firebaseFuncs;
  const docRef = await addDoc(collection(window.db, "tasks"), {
    name, date, month, by, as, priority, completed: false
  });

  tasks.push({ id: docRef.id, name, date, month, by, as, priority, completed: false });
  renderTable();
  document.getElementById("taskForm").reset();
}

async function toggleComplete(index) {
  const task = tasks[index];
  task.completed = !task.completed;

  const { doc, updateDoc } = window.firebaseFuncs;
  await updateDoc(doc(window.db, "tasks", task.id), { completed: task.completed });

  renderTable();
}

async function deleteTask(index) {
  const task = tasks[index];

  const { doc, deleteDoc } = window.firebaseFuncs;
  await deleteDoc(doc(window.db, "tasks", task.id));

  tasks.splice(index, 1);
  renderTable();
}

function moveUp(index) {
  if (index > 0) {
    [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
    renderTable();
  }
}

function moveDown(index) {
  if (index < tasks.length - 1) {
    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    renderTable();
  }
}

document.getElementById("taskForm").addEventListener("submit", addTask);
