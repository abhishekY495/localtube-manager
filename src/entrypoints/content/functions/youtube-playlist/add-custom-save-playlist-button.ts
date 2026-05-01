import { clearExistingCustomSavePlaylistButton } from "@/entrypoints/utils/clear-existing-custom-buttons";
import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import { createCustomSavePlaylistButton } from "@/entrypoints/utils/youtube-playlist/create-custom-save-playlist-button";
import { customSavePlaylistButtonClickHandler } from "@/entrypoints/utils/youtube-playlist/custom-save-playlist-button-click-handler";

export const addCustomSavePlaylistButton = async ({
  listId,
  isSaved,
}: {
  listId: string;
  isSaved: boolean;
}) => {
  const savePlaylistElement = await findElementBySelectors(
    SELECTORS.SAVE_PLAYLIST_ELEMENTS,
  );

  if (savePlaylistElement) {
    const customSavePlaylistButton = createCustomSavePlaylistButton({
      isSaved,
    });

    clearExistingCustomSavePlaylistButton();
    savePlaylistElement.appendChild(customSavePlaylistButton);

    customSavePlaylistButton.addEventListener("click", async () => {
      await customSavePlaylistButtonClickHandler({ listId, isSaved });
      isSaved = !isSaved;
    });
  }
};
