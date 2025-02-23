import DodoPayments from "dodopayments";
import { Notyf } from "notyf";
import { addLicenseKey, clearLicenseKey } from "../../../indexedDB/licenseKey";

const notyf = new Notyf();

export async function validateLicenseKey(
  key: string,
  licenseKeySubmitBtn: HTMLButtonElement,
  isValid?: boolean
) {
  let isLicenseKeyValid: boolean = false;
  if (licenseKeySubmitBtn) {
    licenseKeySubmitBtn.disabled = true;
  }

  try {
    if (key.length > 0) {
      const client = new DodoPayments({
        bearerToken: "DODO_PAYMENTS_API_KEY",
        environment: "live_mode",
      });
      const response = await client.licenses.validate({
        license_key: key,
      });
      console.log(response);

      if (response.valid) {
        isLicenseKeyValid = response.valid;
        await addLicenseKey({
          key,
          isValid: true,
        });
        console.log("Valid License key, adding it");
        if (!isValid) {
          notyf.open({
            type: "success",
            message: "License Key validated.",
            position: { x: "left", y: "top" },
            duration: 3000,
            dismissible: true,
            className: "toast-message",
            icon: false,
          });
        }
      } else {
        notyf.open({
          type: "error",
          message: "Invalid License key",
          position: { x: "left", y: "top" },
          duration: 3000,
          dismissible: true,
          className: "toast-message",
          icon: false,
        });
        console.log("Invalid License key, removing it");
        await clearLicenseKey();
      }
    }
  } catch (error) {
    console.log(error);
    if (isValid) {
      isLicenseKeyValid = true;
    } else {
      notyf.open({
        type: "error",
        message: "Too many requests.<br/>Try again after a few minutes.",
        position: { x: "left", y: "top" },
        duration: 3000,
        dismissible: true,
        className: "toast-message",
        icon: false,
      });
    }
  }

  if (licenseKeySubmitBtn) {
    licenseKeySubmitBtn.disabled = false;
  }

  return {
    isLicenseKeyValid,
  };
}
