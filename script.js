 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import {
  getFirestore, collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDaV7f9MQv7fZkrNsPrqQc1Rozf8Dncqx0",
  authDomain: "tinkertodolist.firebaseapp.com",
  projectId: "tinkertodolist",
  storageBucket: "tinkertodolist.appspot.com", // FIXED typo here
  messagingSenderId: "827903412940",
  appId: "1:827903412940:web:c865125285085a73fe1069",
  measurementId: "G-KHTMBKZP6V"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

let tasks = [];

window.onload = async function () {
  const querySnapshot = await getDocs(collection(db, "tasks"));
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

  const docRef = await addDoc(collection(db, "tasks"), {
    name, date, month, by, as, priority, completed: false
  });

  tasks.push({ id: docRef.id, name, date, month, by, as, priority, completed: false });
  renderTable();
  document.getElementById("taskForm").reset();
}

async function toggleComplete(index) {
  const task = tasks[index];
  task.completed = !task.completed;
  await updateDoc(doc(db, "tasks", task.id), { completed: task.completed });
  renderTable();
}

async function deleteTask(index) {
  const task = tasks[index];
  await deleteDoc(doc(db, "tasks", task.id));
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

document.getElementById("taskForm").addEventListener("submit", addTask);6
// 🔓 Make functions accessible to HTML inline onclick
window.toggleComplete = toggleComplete;
window.moveUp = moveUp;
window.moveDown = moveDown;
window.deleteTask = deleteTask;
