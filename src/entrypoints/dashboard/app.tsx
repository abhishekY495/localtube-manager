import { Header } from "./components/header";
import { PlaylistPage } from "./pages/playlist-page";

export default function App() {
  const [_, search = ""] = window.location.hash.slice(1).split("?");
  const params = new URLSearchParams(search);
  const playlistName = params.get("name");

  return (
    <div className="mx-auto flex h-full max-w-[95%] flex-col gap-8">
      {playlistName && (
        <>
          <Header />
          <PlaylistPage playlistName={playlistName} />
        </>
      )}
    </div>
  );
}
