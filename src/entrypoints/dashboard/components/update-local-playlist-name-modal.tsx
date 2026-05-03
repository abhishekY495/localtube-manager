import { useState, type FormEvent } from "react";
import { updateLocalPlaylistName } from "@/entrypoints/indexedDb/local-playlists";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

export const UpdateLocalPlaylistNameModal = ({
  setIsUpdatePlaylistNameModalOpen,
  playlistName,
  onPlaylistRenamed,
}: {
  setIsUpdatePlaylistNameModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  playlistName: string;
  onPlaylistRenamed: (newName: string) => void;
}) => {
  const [newName, setNewName] = useState(playlistName);

  const closeModal = () => {
    setIsUpdatePlaylistNameModalOpen(false);
    setNewName("");
  };

  const updateButtonHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNewName = newName.trim();
    if (!trimmedNewName) {
      toast.error("Playlist name is required");
      return;
    }

    try {
      await updateLocalPlaylistName(playlistName, trimmedNewName);
      onPlaylistRenamed(trimmedNewName);
      closeModal();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Playlist name already exists"
      ) {
        toast.error("Playlist name already exists");
      } else {
        toast.error("Something went wrong,\n Refresh and try again");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <form
        className="w-[360px] mt-[-420px] border-2 border-neutral-800 bg-neutral-900 rounded"
        onSubmit={updateButtonHandler}
      >
        <div className="flex items-center justify-between gap-2 border-b-2 border-neutral-800 p-4">
          <h2 className="text-lg font-medium">Update playlist name</h2>
          <XIcon onClick={closeModal} size={22} className="cursor-pointer" />
        </div>

        <div className="flex flex-col gap-2" style={{ padding: "12px" }}>
          <input
            id="update-playlist-name"
            className="rounded text-base p-1 px-2 border border-neutral-700 bg-neutral-800 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            placeholder="New playlist name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="flex justify-end gap-3 bg-neutral-800 p-4">
          <button
            type="button"
            className="bg-neutral-700 rounded cursor-pointer border border-neutral-600 text-sm font-semibold p-1 px-3"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-neutral-200 text-black rounded cursor-pointer text-sm font-semibold p-1 px-3"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
