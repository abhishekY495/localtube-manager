import tailwindStyles from "~/assets/tailwind.css?inline";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT,
  CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID,
} from "../constants";
import { clearExistingCustomLocalPlaylistModal } from "../clear-existing-custom-buttons";
import { AddToLocalPlaylistModal } from "@/entrypoints/components/playlists/local/add-to-local-playlist-modal";
import { CreateNewLocalPlaylistModal } from "@/entrypoints/components/playlists/local/create-new-local-playlist-modal";

const LocalPlaylistModalRoot = ({
  onClose,
  videoId,
}: {
  onClose: () => void;
  videoId: string;
}) => {
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);

  if (showCreatePlaylistModal) {
    return <CreateNewLocalPlaylistModal onClose={onClose} videoId={videoId} />;
  }

  return (
    <AddToLocalPlaylistModal
      onClose={onClose}
      setShowCreatePlaylistModal={setShowCreatePlaylistModal}
      videoId={videoId}
    />
  );
};

export const localPlaylistModal = ({ videoId }: { videoId: string }) => {
  const modalHost = document.createElement("div");
  modalHost.id = CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID;

  const shadowRoot = modalHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = tailwindStyles;

  const rootElement = document.createElement("div");
  shadowRoot.append(style, rootElement);

  const root = createRoot(rootElement);
  const stopKeyboardEventPropagation = (event: KeyboardEvent) => {
    event.stopPropagation();
  };

  rootElement.addEventListener("keydown", stopKeyboardEventPropagation);
  rootElement.addEventListener("keypress", stopKeyboardEventPropagation);
  rootElement.addEventListener("keyup", stopKeyboardEventPropagation);

  const closeModal = () => {
    clearExistingCustomLocalPlaylistModal();
  };

  modalHost.addEventListener(
    ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT,
    () => {
      rootElement.removeEventListener("keydown", stopKeyboardEventPropagation);
      rootElement.removeEventListener("keypress", stopKeyboardEventPropagation);
      rootElement.removeEventListener("keyup", stopKeyboardEventPropagation);
      root.unmount();
    },
    { once: true },
  );

  root.render(
    <LocalPlaylistModalRoot onClose={closeModal} videoId={videoId} />,
  );

  return modalHost;
};
