import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  LocalPlaylist,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import toast from "react-hot-toast";
import { Loading } from "../../loading";
import { Error } from "../../error";
import { LocalPlaylistCheckbox } from "./local-playlist-checkbox";
import { SearchBar } from "../../search-bar";

export const LocalPlaylistCheckboxContainer = ({
  videoId,
}: {
  videoId: string;
}) => {
  const [playlists, setPlaylists] = useState<LocalPlaylist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    const getLocalPlaylists = async () => {
      const response: Response<LocalPlaylist[]> =
        await browser.runtime.sendMessage({
          action: ACTIONS.GET_ALL_LOCAL_PLAYLISTS,
        } satisfies Message);
      if (!response.success) {
        toast.error("Something went wrong,\n Refresh and try again");
        setIsLoading(false);
        setError(true);
        return;
      }

      const sortedLocalPlaylist = response.data.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
      setPlaylists(sortedLocalPlaylist);
      setIsLoading(false);
    };
    getLocalPlaylists();
  }, []);

  if (isLoading) {
    return (
      <div
        className="overflow-y-auto"
        style={{
          minHeight: "300px",
          padding: "8px",
        }}
      >
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="overflow-y-auto"
        style={{
          minHeight: "300px",
          padding: "8px",
        }}
      >
        <Error />
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div
        className="overflow-y-auto"
        style={{
          minHeight: "300px",
          padding: "8px",
        }}
      >
        <p
          className="text-center text-neutral-300"
          style={{ fontSize: "14px", marginTop: "50px" }}
        >
          No Local playlists found
        </p>
      </div>
    );
  }

  const filteredPlaylists = playlists.filter((playlist) => {
    return playlist.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div
      className="overflow-y-auto"
      style={{
        minHeight: "300px",
      }}
    >
      <div className="flex flex-col">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="border-neutral-800"
        />
        {filteredPlaylists.length === 0 ? (
          <p
            className="text-center text-neutral-300"
            style={{ fontSize: "14px", marginTop: "60px" }}
          >
            No Local playlists found
          </p>
        ) : (
          filteredPlaylists.map((playlist) => (
            <LocalPlaylistCheckbox
              key={playlist.name}
              playlist={playlist}
              videoId={videoId}
            />
          ))
        )}
      </div>
    </div>
  );
};
