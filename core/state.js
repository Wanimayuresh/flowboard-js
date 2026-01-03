const STORAGE_KEY = "kanban_tasks";

export const state = {
  tasks: loadTasks(),
};

/* ---------- LOAD ---------- */
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/* ---------- SAVE ---------- */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

/* ---------- ADD TASK ---------- */
export function addTask({
  title,
  description = "",
  priority = "high",
}) {
  const validTitle = title.trim();

  if (validTitle.length < 5) {
    return { success: false, error: "Title must be at least 5 characters" };
  }

  const task = {
    id: crypto.randomUUID(), // ✅ safer than Date.now()
    title: validTitle,
    description,
    priority,
    status: "todo",
    createdAt: Date.now(),
  };

  state.tasks.push(task);
  saveTasks();

  return { success: true, task };
}

/* ---------- UPDATE TASK ---------- */
export function updateTask(taskId, updates = {}) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return { success: false, error: "Task not found" };

  const allowedStatus = ["todo", "progress", "done"];
  if (updates.status && !allowedStatus.includes(updates.status)) {
    return { success: false, error: "Invalid status" };
  }

  if (updates.title && updates.title.trim().length < 5) {
    return { success: false, error: "Title must be at least 5 characters" };
  }

  Object.assign(task, updates);
  saveTasks();

  return { success: true, task };
}

/* ---------- DELETE TASK ---------- */
export function deleteTask(taskId) {
  const originalLength = state.tasks.length;

  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  saveTasks();

  if (state.tasks.length === originalLength) {
    return { success: false, error: "Task not found" };
  }

  return { success: true };
}
