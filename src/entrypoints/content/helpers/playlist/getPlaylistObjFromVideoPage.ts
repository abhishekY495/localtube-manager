import { YoutubePlaylist } from "@/entrypoints/types";

export function getPlaylistObjFromVideoPage(containerElement: HTMLElement) {
  const playlistHeaderElement = containerElement.querySelector(
    "#header-description",
  ) as HTMLElement;
  const playlistHeaderElementLink = playlistHeaderElement.querySelector(
    "a",
  ) as HTMLAnchorElement;

  // Cover image url slug
  const itemsElement = containerElement.querySelector("#items") as HTMLElement;
  const videosElements = itemsElement.querySelectorAll(
    "#playlist-items",
  ) as NodeList;
  const video = videosElements[0] as HTMLElement;
  const videoLinkElement = video.querySelector("a") as HTMLAnchorElement;
  const urlSlug = videoLinkElement.href.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/,
  );

  // channel name and handle
  const publisherContainerElement = playlistHeaderElement.querySelector(
    "#publisher-container",
  ) as HTMLElement;
  const ytFormattedString = publisherContainerElement.querySelector(
    "yt-formatted-string.publisher",
  );
  const ytFormattedStringLinkElement = ytFormattedString?.querySelector(
    "a",
  ) as HTMLAnchorElement;

  // videos count
  const spanElements = publisherContainerElement.querySelectorAll(
    "span",
  ) as NodeList;
  const videosCountElement = spanElements[
    spanElements.length - 1
  ] as HTMLElement;

  const params = new URL(playlistHeaderElementLink?.href).searchParams;
  const playlistId = params.get("list");

  const playlist: YoutubePlaylist = {
    name: playlistHeaderElementLink?.innerText,
    urlSlug: playlistId || "",
    coverImageUrlSlug: urlSlug ? urlSlug[1] : "",
    videosCount: Number(videosCountElement.innerText) || 0,
    channelName: ytFormattedStringLinkElement.innerText || "",
    addedAt: new Date().toISOString(),
  };

  return playlist;
}
