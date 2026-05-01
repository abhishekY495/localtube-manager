import { ACTIONS } from "@/entrypoints/utils/constants";
import type { Message, Response } from "@/entrypoints/utils/types";
import { getVideoData } from "@/entrypoints/utils/video/get-video-data";
import { XIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

export const CreateNewLocalPlaylistModal = ({
  onClose,
  videoId,
}: {
  onClose: () => void;
  videoId: string;
}) => {
  const [playlistName, setPlaylistName] = useState("");

  const createPlaylistHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPlaylistName = playlistName.trim();
    if (!trimmedPlaylistName) {
      toast.error("Playlist name is required");
      return;
    }

    const video = await getVideoData(videoId, document);

    const playlist = {
      name: trimmedPlaylistName,
      addedAt: new Date().toISOString(),
      videos: [video],
    };

    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.ADD_LOCAL_PLAYLIST,
      data: { playlist },
    } satisfies Message);

    if (response.success) {
      toast.success("Local playlist created");
      setPlaylistName("");
      onClose();
    } else {
      if (response.error === "Playlist name already exists") {
        toast.error("Playlist name already exists");
      } else {
        toast.error("Something went wrong,\n Refresh and try again");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-2147483646 flex items-center justify-center bg-black/60 text-white"
      onClick={onClose}
    >
      <form
        className="w-[420px] rounded-xl border-2 border-neutral-800 bg-neutral-900"
        onClick={(event) => event.stopPropagation()}
        onSubmit={createPlaylistHandler}
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
            Create Local playlist
          </h2>
          <XIcon onClick={onClose} size={22} className="cursor-pointer" />
        </div>

        <div className="flex flex-col gap-2" style={{ padding: "12px" }}>
          <input
            id="create-local-playlist-name"
            className="rounded-lg border border-neutral-700 bg-neutral-800 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            style={{
              fontSize: "14px",
              padding: "4px 8px",
            }}
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={(event) => setPlaylistName(event.target.value)}
            autoFocus
            required
          />
        </div>

        <div
          className="flex justify-end gap-3 bg-neutral-800"
          style={{ padding: "12px" }}
        >
          <button
            type="button"
            className="bg-neutral-700 rounded-lg cursor-pointer border border-neutral-600"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              paddingInline: "14px",
              paddingBlock: "4px",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-neutral-200 text-black rounded-lg cursor-pointer"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              paddingInline: "14px",
              paddingBlock: "4px",
            }}
          >
            Create and add video
          </button>
        </div>
      </form>
    </div>
  );
};
