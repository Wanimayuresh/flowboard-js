import { addTask, deleteTask, state, updateTask } from "../core/state.js";
import { renderBoard } from "./render.js";

export function setupModals() {
  /* ================= ADD TASK MODAL ================= */

  const addTaskBtn = document.querySelector(".add-task-btn");
  const addTaskModal = document.getElementById("add-task-modal");
  const addTaskInput = document.getElementById("add-task-title");
  const addTaskDesc = document.getElementById("add-task-desc");
  const addTaskPriority = document.getElementById("add-task-priority");
  const addTaskSaveBtn = document.getElementById("add-task-save");
  const addTaskCloseBtn = document.getElementById("add-task-cancel");

  let lastFocusedElement = null;
  let focusableElements = [];

  /* ---------- OPEN ADD MODAL ---------- */
  addTaskBtn.addEventListener("click", () => {
    lastFocusedElement = document.activeElement;
    addTaskModal.classList.add("active");

    focusableElements = addTaskModal.querySelectorAll(
      "input, textarea, select, button"
    );

    addTaskInput.focus();
  });

  /* ---------- CLOSE ADD MODAL ---------- */
  function closeAddTaskModal() {
    addTaskModal.classList.remove("active");
    lastFocusedElement?.focus();
    resetAddTaskForm();
  }

  addTaskCloseBtn.addEventListener("click", closeAddTaskModal);

  addTaskModal.addEventListener("click", (e) => {
    if (e.target === addTaskModal) closeAddTaskModal();
  });

  /* ---------- VALIDATION ---------- */
  addTaskSaveBtn.disabled = true;

  addTaskInput.addEventListener("input", (e) => {
    addTaskSaveBtn.disabled = e.target.value.trim().length < 5;
  });

  /* ---------- ENTER TO SAVE ---------- */
  addTaskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !addTaskSaveBtn.disabled) {
      handleAddTask();
    }
  });

  /* ---------- ESC + FOCUS TRAP ---------- */
  addTaskModal.addEventListener("keydown", (e) => {
    if (!addTaskModal.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeAddTaskModal();
    }

    if (e.key === "Tab") {
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- SAVE TASK ---------- */
  function handleAddTask() {
    const result = addTask({
      title: addTaskInput.value,
      description: addTaskDesc.value,
      priority: addTaskPriority.value,
    });

    if (!result.success) {
      alert(result.error);
      return;
    }

    closeAddTaskModal();
    renderBoard(openTaskModal);
  }

  addTaskSaveBtn.addEventListener("click", handleAddTask);

  function resetAddTaskForm() {
    addTaskInput.value = "";
    addTaskDesc.value = "";
    addTaskPriority.value = "high";
    addTaskSaveBtn.disabled = true;
  }

  /* ================= EDIT TASK MODAL ================= */

  const editTaskModal = document.getElementById("task-modal");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescInput = document.getElementById("task-desc");
  const taskPrioritySelect = document.getElementById("task-priority");
  const taskStatusSelect = document.getElementById("task-status");
  const saveTaskBtn = document.getElementById("save-task");
  const closeTaskModalBtn = document.getElementById("close-task-modal");
  const deleteTaskBtn = document.getElementById("delete-task");

  let currentTaskId = null;

  /* ---------- OPEN EDIT MODAL ---------- */
  window.openTaskModal = function (taskId) {
    currentTaskId = taskId;

    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    taskTitleInput.value = task.title;
    taskDescInput.value = task.description || "";
    taskPrioritySelect.value = task.priority;
    taskStatusSelect.value = task.status;

    editTaskModal.classList.add("active");
  };

  /* ---------- CLOSE EDIT MODAL ---------- */
  closeTaskModalBtn.addEventListener("click", () => {
    editTaskModal.classList.remove("active");
    currentTaskId = null;
  });

  /* ---------- SAVE EDIT ---------- */
  saveTaskBtn.addEventListener("click", () => {
    if (!currentTaskId) return;

    const result = updateTask(currentTaskId, {
      title: taskTitleInput.value.trim(),
      description: taskDescInput.value.trim(),
      priority: taskPrioritySelect.value,
      status: taskStatusSelect.value,
    });

    if (!result.success) {
      alert(result.error);
      return;
    }

    editTaskModal.classList.remove("active");
    currentTaskId = null;
    renderBoard(openTaskModal);
  });

  /* ---------- DELETE TASK (ONCE) ---------- */
  deleteTaskBtn.addEventListener("click", () => {
    if (!currentTaskId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    deleteTask(currentTaskId);
    currentTaskId = null;
    // console.log("Deleted");
    
    editTaskModal.classList.remove("active");
    renderBoard(openTaskModal);
  });
}
