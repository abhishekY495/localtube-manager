import { useState, useEffect } from "react";
import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  LocalPlaylist,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import toast from "react-hot-toast";
import { PlusIcon, XIcon } from "lucide-react";
import { PlaylistCheckboxContainer } from "./playlist-checkbox-container";

export const AddToLocalPlaylistModal = ({
  onClose,
  setShowCreatePlaylistModal,
  videoId,
}: {
  onClose: () => void;
  setShowCreatePlaylistModal: (show: boolean) => void;
  videoId: string;
}) => {
  const [playlists, setPlaylists] = useState<LocalPlaylist[]>([]);

  useEffect(() => {
    const getLocalPlaylists = async () => {
      const response: Response<LocalPlaylist[]> =
        await browser.runtime.sendMessage({
          action: ACTIONS.GET_ALL_LOCAL_PLAYLISTS,
        } satisfies Message);
      if (!response.success) {
        toast.error("Something went wrong,\n Refresh and try again");
        return;
      }

      const sortedLocalPlaylist = response.data.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
      setPlaylists(sortedLocalPlaylist);
    };
    getLocalPlaylists();
  }, []);

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
        <div className="min-h-[300px] overflow-y-auto p-2">
          {playlists.length === 0 ? (
            <p
              className="text-center text-neutral-300"
              style={{ fontSize: "14px", marginTop: "50px" }}
            >
              No Local playlists found
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              <PlaylistCheckboxContainer
                playlists={playlists}
                videoId={videoId}
              />
            </div>
          )}
        </div>
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
