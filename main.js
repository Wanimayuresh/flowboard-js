import { setupModals } from "./ui/modal.js";
import { renderBoard } from "./ui/render.js";


// Initialize modals
setupModals();

// Initial render
renderBoard(window.openTaskModal);
