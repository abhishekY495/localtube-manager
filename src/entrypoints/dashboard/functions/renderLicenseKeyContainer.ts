import { main } from "../main";
import { validateLicenseKey } from "./licenseKey/validateLicenseKey";

export function renderLicenseKeyContainer() {
  const licenseKeyContainer = document.querySelector(
    "#license-key-container"
  ) as HTMLButtonElement;
  const iHaveLicenseKeyBtn = document.querySelector(
    ".i-have-license-key-btn"
  ) as HTMLButtonElement;
  const licenseKeyForm = document.querySelector(
    ".license-key-form"
  ) as HTMLFormElement;
  const licenseKeyInput = document.querySelector(
    ".license-key-input"
  ) as HTMLInputElement;
  const licenseKeySubmitBtn = document.querySelector(
    ".license-key-submit-btn"
  ) as HTMLButtonElement;
  const importExportContainer = document.querySelector(
    "#import-export-container"
  ) as HTMLElement;
  const importExportIconContainer = document.querySelector(
    ".import-export-icon-container"
  ) as HTMLElement;

  iHaveLicenseKeyBtn.addEventListener("click", () => {
    licenseKeyForm.style.display = "flex";
    importExportContainer.style.display = "none";
    importExportIconContainer.classList.remove(
      "selected-import-export-icon-container"
    );
  });

  licenseKeyInput.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement | null;
    if (!target) return;

    const value: string = target.value;
    if (value.trim().length > 0) {
      licenseKeySubmitBtn.disabled = false;
    } else {
      licenseKeySubmitBtn.disabled = true;
    }
  });

  licenseKeyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = licenseKeyInput.value;
    console.log(key);
    const data = await validateLicenseKey(key, licenseKeySubmitBtn);
    if (data.isLicenseKeyValid) {
      licenseKeyContainer.remove();
      main();
    }
  });
}
