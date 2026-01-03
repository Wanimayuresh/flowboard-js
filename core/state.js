export const state = {
  tasks: []
};

// Add a new task
export function addTask({ title, description = "", priority = "high", status = "todo" }) {
  const validTitle = title.trim();
  if (validTitle.length < 5) {
    return { success: false, error: "Title must be at least 5 characters" };
  }

  const task = {
    id: Date.now(),
    title: validTitle,
    description,
    priority,
    status,
    createdAt: Date.now()
  };

  state.tasks.push(task);

  return { success: true, task };
}

// Update an existing task
export function updateTask(taskId, updates = {}) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return { success: false, error: "Task not found" };

  const allowedStatus = ["todo", "progress", "done"];
  if (updates.status && !allowedStatus.includes(updates.status)) {
    return { success: false, error: "Invalid status" };
  }

  if (updates.title && updates.title.trim().length < 5) {
    return { success: false, error: "Title must be at least 5 characters" };
  }

  Object.assign(task, updates);

  return { success: true, task };
}

//Delete a task 
export function deleteTask(taskId){
  const originalLength = state.tasks.length
   state.tasks = state.tasks.filter((task)=>task.id!==taskId)
   if(originalLength===state.tasks.length){
    return {success:false,error:"Task not found"}
   }
   return {success:true};

}