import { Notyf } from "notyf";
import { loader2 } from "../helpers/loader2";
import { clearDB } from "@/entrypoints/indexedDB/clearDB";

let countdown: number = 9;
const notyf = new Notyf();

const clearAllBtn = document.getElementById(
  "clear-all-btn"
)! as HTMLButtonElement;
clearAllBtn.addEventListener("click", async () => {
  showModal();
});

let allowModalClose = true;
function showModal() {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Are you sure?</p>
      <p class="modal-message">This will permanently clear all your <span>Liked videos</span>, <span>Subscribed channels</span>, <span>Youtube playlists</span> and <span>Local playlists</span> data. You won't be able to recover them.<br/>Proceed with caution.</p>
      <div class="modal-buttons-container">
        <button class="modal-clear-all-btn">Clear All</button>
        <button class="modal-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const clearAllBtn = modal.querySelector(
    ".modal-clear-all-btn"
  )! as HTMLButtonElement;
  const cancelBtn = modal.querySelector(
    ".modal-cancel-btn"
  )! as HTMLButtonElement;

  // Add event listener to "Clear All" button
  clearAllBtn.addEventListener("click", async () => {
    clearAllBtn.innerHTML = `Clearing ${loader2}`;
    cancelBtn.disabled = true;
    allowModalClose = false;
    const { success, error } = await clearDB();
    if (success) {
      closeModal(modal);
      showClearedDataModal();
      notyf.open({
        type: "success",
        message: "Data Cleared Successfully",
        position: { x: "left", y: "top" },
        duration: 3000,
        dismissible: true,
        className: "toast-message",
        icon: false,
      });
      const counter = document.querySelector(".counter")! as HTMLSpanElement;
      const intervalId = setInterval(() => {
        counter.innerText = String(countdown);
        countdown--;
        if (countdown < 0) {
          clearInterval(intervalId);
          location.reload();
        }
      }, 1000);
    } else if (error) {
      clearAllBtn.textContent = "Clear All";
      notyf.open({
        type: "error",
        message: "Something went wrong <br />Please refresh and try again ",
        position: { x: "left", y: "bottom" },
        duration: 4000,
        dismissible: true,
        className: "toast-message",
        icon: false,
      });
    }
  });

  // Add event listener to "Cancel" button
  cancelBtn.addEventListener("click", () => closeModal(modal));

  // Close modal when clicking outside of it
  modal.addEventListener("click", (e) => {
    if (e.target === modal && allowModalClose) {
      closeModal(modal);
    }
  });
}

function showClearedDataModal() {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Successful</p>
      <div class="import-modal-buttons-container">
        <p>Data cleared successfully. The page will automatically reload in <span class="counter">${countdown}</span> seconds</p>
        <button class="modal-reload-btn">Reload</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Reload" button
  const reloadBtn = modal.querySelector(".modal-reload-btn")!;
  reloadBtn.addEventListener("click", async () => {
    location.reload();
  });
}

function closeModal(modal: HTMLElement) {
  modal.remove();
}
