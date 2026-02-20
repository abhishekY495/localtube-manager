import { YoutubePlaylist } from "@/entrypoints/types";

export function getPlaylistObjFromPlaylistPage(
  pageHeaderViewModel: HTMLElement,
  playlistUrlSlug: string,
) {
  const headerInfoElement = pageHeaderViewModel.querySelector(
    ".page-header-view-model-wiz__page-header-headline-info",
  ) as HTMLElement;

  // playlist name
  const h1Element = headerInfoElement.querySelector("h1") as HTMLElement;

  // Cover image url slug
  const headerImageContainer = headerInfoElement.querySelector(
    ".page-header-view-model-wiz__page-header-headline-image-hero-container",
  ) as HTMLElement;
  const imageElements = headerImageContainer.querySelectorAll(
    "img",
  ) as NodeList;
  const imageEle = imageElements[0] as HTMLImageElement;
  const parsedImageUrl = new URL(imageEle.src);

  // channel name and handle
  const ytContentMetaDataViewModel = headerInfoElement.querySelector(
    "yt-content-metadata-view-model",
  ) as HTMLElement;
  const linkElements = ytContentMetaDataViewModel.querySelectorAll(
    "a",
  ) as NodeList;
  const linkEle = linkElements[0] as HTMLAnchorElement;
  const channelName = linkEle?.innerText?.includes("by")
    ? linkEle?.innerText?.split("by")[1]
    : linkEle.innerText;

  // video count
  const spanElements = ytContentMetaDataViewModel.querySelectorAll(
    "span",
  ) as NodeList;
  const videosCountElement =
    spanElements.length === 7
      ? (spanElements[spanElements.length - 3] as HTMLElement)
      : null;
  const videosCount = videosCountElement?.innerText?.split("videos")[0];

  const playlist: YoutubePlaylist = {
    name: h1Element?.innerText || "",
    urlSlug: playlistUrlSlug || "",
    coverImageUrlSlug: parsedImageUrl
      ? parsedImageUrl.pathname.split("/")[2]
      : "",
    videosCount: Number(videosCount) || 0,
    channelName: channelName || "",
    addedAt: new Date().toISOString(),
  };

  return playlist;
}
