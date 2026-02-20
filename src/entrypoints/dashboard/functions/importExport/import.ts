import { Notyf } from "notyf";
import { loader } from "../../helpers/loader";
import { importDB } from "@/entrypoints/indexedDB/importDB";

let countdown: number = 9;

(async () => {
  const notyf = new Notyf();
  const importForm = document.getElementById(
    "import-container",
  ) as HTMLFormElement;
  const importButton = document.getElementById(
    "import-btn",
  )! as HTMLButtonElement;
  const googleTakeoutBtnText = document.getElementById(
    "google-takeout-btn-text",
  )! as HTMLSpanElement;
  const importFileInput = document.getElementById(
    "import-file-input",
  )! as HTMLInputElement;
  const fileNameDisplay = document.getElementById(
    "import-file-name-display",
  )! as HTMLParagraphElement;
  let selectedFile: any = null;

  importFileInput.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target?.files && target?.files?.length > 0) {
      selectedFile = target?.files[0];
      const fileName = selectedFile?.name;
      const fileExtension = fileName.split(".")?.pop()?.toLowerCase();
      if (fileExtension === "json" || fileExtension === "csv") {
        fileNameDisplay.innerText = fileName;
      } else {
        selectedFile = null;
        target.value = "";
        notyf.open({
          type: "error",
          message: "Invalid file type <br />Please select a .json or .csv file",
          position: { x: "left", y: "bottom" },
          duration: 3000,
          dismissible: true,
          className: "toast-message",
          icon: false,
        });
      }
    } else {
      selectedFile = null;
      target.value = "";
      fileNameDisplay.innerText = "";
      fileNameDisplay.innerText = "No File Selected";
    }
  });

  importForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (selectedFile && selectedFile.type.includes("csv")) {
      googleTakeoutBtnText.innerHTML = `Importing ${loader}`;
    } else {
      importButton.innerHTML = `Importing ${loader}`;
    }
    if (selectedFile) {
      const content = await selectedFile.text();
      try {
        const { success, error } = await importDB(content, selectedFile.type);
        if (success) {
          notyf.open({
            type: "success",
            message: "Data Imported Successfully",
            position: { x: "left", y: "top" },
            duration: 3000,
            dismissible: true,
            className: "toast-message",
            icon: false,
          });
          importButton.innerHTML = "Import";
          googleTakeoutBtnText.innerHTML = "Takeout";
          showModal(countdown);
          const counter = document.querySelector(
            ".counter",
          )! as HTMLSpanElement;
          const intervalId = setInterval(() => {
            counter.innerText = String(countdown);
            countdown--;

            if (countdown < 0) {
              clearInterval(intervalId);
              location.reload();
            }
          }, 1000);
        }
        if (error) {
          notyf.open({
            type: "error",
            message: "Something went wrong, <br />Refresh and try again",
            position: { x: "left", y: "bottom" },
            duration: 4000,
            dismissible: true,
            className: "toast-message",
            icon: false,
          });
          importButton.innerHTML = "Import";
          googleTakeoutBtnText.innerHTML = "Takeout";
        }
      } catch (error) {
        console.log("Error importing database:", error);
        notyf.open({
          type: "error",
          message: "Something went wrong, <br />Refresh and try again",
          position: { x: "left", y: "bottom" },
          duration: 4000,
          dismissible: true,
          className: "toast-message",
          icon: false,
        });
        importButton.innerHTML = "Import";
        googleTakeoutBtnText.innerHTML = "Takeout";
      }
    } else {
      console.log("file not selected");
      notyf.open({
        type: "error",
        message: "No File Selected",
        position: { x: "left", y: "bottom" },
        duration: 4000,
        dismissible: true,
        className: "toast-message",
        icon: false,
      });
      importButton.innerHTML = "Import";
      googleTakeoutBtnText.innerHTML = "Takeout";
    }
  });
})();

function showModal(countdown: number) {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Import Successful</p>
      <div class="import-modal-buttons-container">
        <p>Data imported successfully, Click the reload button to see your data. The page will automatically reload in <span class="counter">${countdown}</span> seconds</p>
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
