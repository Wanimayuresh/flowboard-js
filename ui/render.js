import { state, updateTask } from "../core/state.js";

let draggedTaskId = null;

export function renderBoard(openTaskModal) {
  const columns = document.querySelectorAll(".column");

  /* ---------- EMPTY BOARD ---------- */
  if (state.tasks.length === 0) {
    showEmptyBoard();
  } else {
    hideEmptyBoard();
  }

  columns.forEach(column => {
    const status = column.dataset.status;
    const taskList = column.querySelector(".task-list");

    // Clear column
    taskList.innerHTML = "";

    // Tasks for this column
    const tasks = state.tasks.filter(task => task.status === status);

    // Update count
    column.querySelector("span").textContent = tasks.length;

    /* ---------- DRAG TARGET (COLUMN) ---------- */
    column.addEventListener("dragover", e => {
      e.preventDefault(); // REQUIRED for drop
      column.classList.add("drag-over");
      
    });

    column.addEventListener("dragleave", e => {
  if (!column.contains(e.relatedTarget)) {
    column.classList.remove("drag-over");
  }
});


    column.addEventListener("drop", () => {
      if (!draggedTaskId) return;
      
      updateTask(draggedTaskId, { status });
      draggedTaskId = null;
      column.classList.remove("drag-over");
      renderBoard(openTaskModal);
    });

    /* ---------- EMPTY COLUMN UI ---------- */
    if (tasks.length === 0) {
      taskList.innerHTML = `<p class="empty-column">No tasks</p>`;
    }

    /* ---------- RENDER TASKS ---------- */
    tasks.forEach(task => {
      const taskEl = document.createElement("div");
      taskEl.className = "task";
      taskEl.draggable = true;
      taskEl.dataset.taskId = task.id;

      taskEl.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        ${task.description ? `<p class="task-desc">${task.description}</p>` : ""}
        <span class="task-priority">${task.priority}</span>
      `;

      /* ---------- OPEN MODAL ---------- */
      taskEl.addEventListener("click", () => openTaskModal(task.id));

      /* ---------- DRAG SOURCE ---------- */
      taskEl.addEventListener("dragstart", () => {
        draggedTaskId = task.id;
        taskEl.classList.add("dragging");
      });

      taskEl.addEventListener("dragend",()=>{
        taskEl.classList.remove("dragging")
        draggedTaskId=null;
      })

      taskList.appendChild(taskEl);
    });
  });
}

/* ---------- EMPTY BOARD UI ---------- */

function showEmptyBoard() {
  let empty = document.querySelector(".empty-board");

  if (!empty) {
    empty = document.createElement("div");
    empty.className = "empty-board";
    empty.innerHTML = `
      <h2>📋 No tasks yet</h2>
      <p>Start organizing your work by adding your first task</p>
      <button type="button" class="add-task-btn">Add Task</button>
    `;

    document.querySelector(".board").prepend(empty);

    empty.querySelector(".add-task-btn").addEventListener("click", () => {
      document.getElementById("add-task-modal")?.classList.add("active");
    });
  }

  empty.style.display = "block";
}

function hideEmptyBoard() {
  const empty = document.querySelector(".empty-board");
  if (empty) empty.style.display = "none";
}
