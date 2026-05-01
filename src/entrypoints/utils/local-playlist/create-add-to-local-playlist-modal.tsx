import tailwindStyles from "~/assets/tailwind.css?inline";
import { createRoot } from "react-dom/client";
import {
  ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT,
  CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID,
} from "../constants";
import { clearExistingCustomAddToLocalPlaylistModal } from "../clear-existing-custom-buttons";
import { AddToLocalPlaylistModal } from "@/entrypoints/components/playlists/local/add-to-local-playlist-modal";

export const createAddToLocalPlaylistModal = () => {
  const modalHost = document.createElement("div");
  modalHost.id = CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID;

  const shadowRoot = modalHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = tailwindStyles;

  const rootElement = document.createElement("div");
  shadowRoot.append(style, rootElement);

  const root = createRoot(rootElement);

  const closeModal = () => {
    root.unmount();
    clearExistingCustomAddToLocalPlaylistModal();
  };

  modalHost.addEventListener(
    ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT,
    () => root.unmount(),
    { once: true },
  );

  root.render(
    <AddToLocalPlaylistModal onClose={closeModal} />,
  );

  return modalHost;
};
