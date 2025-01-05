import { Notyf } from "notyf";
import { formatFileSize } from "../helpers/formatFileSize";
import { clearDB } from "../../indexedDB/clearDB";
import { exportDB } from "../../indexedDB/exportDB";
import { importDB } from "../../indexedDB/importDB";
import { loader } from "../helpers/loader";

(async () => {
  const notyf = new Notyf();
  const importForm = document.getElementById(
    "import-container"
  ) as HTMLFormElement;
  const importButton = document.getElementById(
    "import-btn"
  )! as HTMLButtonElement;
  const importFileInput = document.getElementById(
    "import-file-input"
  )! as HTMLInputElement;
  const fileNameDisplay = document.getElementById(
    "import-file-name-display"
  )! as HTMLParagraphElement;
  //
  //
  const exportBtn = document.getElementById("export-btn")! as HTMLButtonElement;
  const exportFileSize = document.getElementById(
    "export-file-size"
  )! as HTMLSpanElement;
  let selectedFile: any = null;
  let isImporting: boolean = false;

  const exportData = await exportDB();
  const blob = new Blob([exportData], { type: "application/json" });
  exportFileSize.innerText = formatFileSize(blob.size);
  exportBtn?.addEventListener("click", async () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "NoLoginYT.json";
    a.click();
    a.remove();
  });

  importFileInput.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target?.files && target?.files?.length > 0) {
      selectedFile = target?.files[0];
      const fileName = selectedFile?.name;
      const fileExtension = fileName.split(".")?.pop()?.toLowerCase();
      if (fileExtension === "json") {
        fileNameDisplay.innerText = fileName;
      } else {
        selectedFile = null;
        target.value = "";
        notyf.open({
          type: "error",
          message: "Invalid file type <br />Please select a .json file",
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
    isImporting = true;
    importButton.innerHTML = `Importing ${loader}`;
    if (selectedFile) {
      const content = await selectedFile.text();
      try {
        const { success, error } = await importDB(content);
        if (success) {
          isImporting = false;
          notyf.open({
            type: "success",
            message: "Data Imported Successfully",
            position: { x: "left", y: "top" },
            duration: 3000,
            dismissible: true,
            className: "toast-message",
            icon: false,
          });
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
          isImporting = false;
          importButton.innerHTML = "Import";
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
        isImporting = false;
        importButton.innerHTML = "Import";
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
      isImporting = false;
      importButton.innerHTML = "Import";
    }
  });
})();

const clearAllBtn = document.getElementById(
  "clear-all-btn"
)! as HTMLButtonElement;
clearAllBtn.addEventListener("click", async () => {
  const { success, error } = await clearDB();
  console.log(success);
  console.log(error);
});
