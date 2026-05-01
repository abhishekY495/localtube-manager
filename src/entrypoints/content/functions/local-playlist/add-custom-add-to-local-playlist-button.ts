import {
  clearExistingCustomAddToLocalPlaylistButton,
  clearExistingCustomAddToLocalPlaylistModal,
} from "@/entrypoints/utils/clear-existing-custom-buttons";
import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import { createCustomAddToLocalPlaylistButton } from "@/entrypoints/utils/local-playlist/create-custom-add-to-local-playlist-button";
import { createAddToLocalPlaylistModal } from "@/entrypoints/utils/local-playlist/create-add-to-local-playlist-modal";

export const addCustomAddToLocalPlaylistButton = async () => {
  const customAddToLocalPlaylistButtonElement = await findElementBySelectors(
    SELECTORS.ADD_TO_LOCAL_PLAYLIST_BUTTON_ELEMENTS,
  );

  if (customAddToLocalPlaylistButtonElement) {
    const customAddToLocalPlaylistButton =
      createCustomAddToLocalPlaylistButton();

    clearExistingCustomAddToLocalPlaylistButton();
    customAddToLocalPlaylistButtonElement.appendChild(
      customAddToLocalPlaylistButton,
    );

    customAddToLocalPlaylistButton.addEventListener("click", async () => {
      clearExistingCustomAddToLocalPlaylistModal();
      const modal = createAddToLocalPlaylistModal();
      document.body.appendChild(modal);
    });
  }
};
