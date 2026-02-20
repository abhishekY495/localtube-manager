import { exportDB } from "@/entrypoints/indexedDB/exportDB";
import { Notyf } from "notyf";
import { formatFileSize } from "../../helpers/formatFileSize";

(async () => {
  const notyf = new Notyf();
  const exportBtn = document.getElementById("export-btn")! as HTMLButtonElement;
  const exportFileSize = document.getElementById(
    "export-file-size",
  )! as HTMLSpanElement;

  try {
    const exportData = await exportDB();
    const blob = new Blob([exportData], { type: "application/json" });
    exportFileSize.innerText = formatFileSize(blob.size);

    exportBtn.addEventListener("click", async () => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LocalTubeDB.json";
      a.click();
      a.remove();
    });
  } catch (error) {
    console.log(error);
    notyf.open({
      type: "error",
      message: "Something went wrong, <br />Refresh and try again",
      position: { x: "left", y: "bottom" },
      duration: 4000,
      dismissible: true,
      className: "toast-message",
      icon: false,
    });
  }
})();
