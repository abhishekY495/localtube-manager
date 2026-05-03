import { Header } from "./components/header";
import { LocalPlaylistsPage } from "./pages/local-playlists-page";
import { PlaylistPage } from "./pages/playlist-page";

export default function App() {
  const [_, search = ""] = window.location.hash.slice(1).split("?");
  const params = new URLSearchParams(search);
  const playlistName = params.get("name");

  return (
    <div className="mx-auto flex h-full max-w-[95%] flex-col gap-8">
      <Header />
      {playlistName ? (
        <PlaylistPage playlistName={playlistName} />
      ) : (
        <LocalPlaylistsPage />
      )}
    </div>
  );
}
