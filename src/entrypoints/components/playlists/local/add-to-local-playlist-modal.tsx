import { PlusIcon, XIcon } from "lucide-react";
import { LocalPlaylistCheckboxContainer } from "./local-playlist-checkbox-container";

export const AddToLocalPlaylistModal = ({
  onClose,
  setShowCreatePlaylistModal,
  videoId,
}: {
  onClose: () => void;
  setShowCreatePlaylistModal: (show: boolean) => void;
  videoId: string;
}) => {
  return (
    <div
      className="fixed inset-0 z-2147483646 flex items-center justify-center bg-black/60 text-white"
      onClick={onClose}
    >
      <div
        className="border-2 border-neutral-800 bg-neutral-900 rounded-xl"
        style={{ width: "420px" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-2 border-b-2 border-neutral-800"
          style={{
            padding: "14px 16px 16px 16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            Local playlists
          </h2>
          <XIcon onClick={onClose} size={22} className="cursor-pointer" />
        </div>
        {/*  */}
        <LocalPlaylistCheckboxContainer videoId={videoId} />
        {/*  */}
        <div
          className="flex justify-end gap-5 bg-neutral-800"
          style={{ padding: "12px 10px" }}
        >
          <button
            className="w-full flex items-center justify-center gap-2 text-neutral-300 bg-neutral-700 rounded-xl cursor-pointer border border-neutral-600 hover:bg-neutral-600"
            onClick={() => setShowCreatePlaylistModal(true)}
            style={{
              fontSize: "15px",
              fontWeight: 500,
              padding: "5px 0 8px 0",
            }}
          >
            Create <PlusIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
