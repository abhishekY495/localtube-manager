import { useEffect, useState } from "react";
import { Header } from "./components/header";
import { PlaylistPage } from "./pages/playlist-page";

const getPlaylistNameFromHash = () => {
  const [, search = ""] = window.location.hash.slice(1).split("?");
  const params = new URLSearchParams(search);
  return params.get("name");
};

export default function App() {
  const [playlistName, setPlaylistName] = useState(getPlaylistNameFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setPlaylistName(getPlaylistNameFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
