import { state } from "../core/state.js";

export function renderBoard(openTaskModal) {
  const columns = document.querySelectorAll(".column");

  columns.forEach(column => {
    const status = column.dataset.status;
    const taskList = column.querySelector(".task-list");

    // Clear previous tasks
    taskList.innerHTML = "";

    // Filter tasks by status
    const tasks = state.tasks.filter(task => task.status === status);

    // Update column count
    column.querySelector("span").textContent = tasks.length;

    // Render tasks
    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.dataset.taskId = task.id;
      div.draggable = true;

      div.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        ${task.description ? `<p class="task-desc">${task.description}</p>` : ""}
        <span class="task-priority">${task.priority}</span>
      `;

      div.addEventListener("click", () => openTaskModal(task.id));

      taskList.appendChild(div);
   });
  });
}
