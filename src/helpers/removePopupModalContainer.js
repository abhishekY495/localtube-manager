export function removePopupModalContainer() {
  const popupContainer = document.querySelector(
    "ytd-modal-with-title-and-button-renderer"
  );
  if (popupContainer) {
    popupContainer.remove();
    console.log("Popup container removed");
  }
}
