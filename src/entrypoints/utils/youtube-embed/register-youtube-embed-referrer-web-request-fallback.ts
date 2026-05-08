import { getYoutubeEmbedReferrer } from "./get-youtube-embed-referrer";

export const registerYoutubeEmbedReferrerWebRequestFallback = () => {
  let youtubeEmbedWebRequestFallbackRegistered = false;

  if (youtubeEmbedWebRequestFallbackRegistered || !browser.webRequest) {
    return;
  }

  browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      const requestHeaders = details.requestHeaders ?? [];
      const refererHeader = requestHeaders.find(
        (header) => header.name.toLowerCase() === "referer",
      );

      if (refererHeader) {
        refererHeader.value = getYoutubeEmbedReferrer();
      } else {
        requestHeaders.push({
          name: "Referer",
          value: getYoutubeEmbedReferrer(),
        });
      }

      return { requestHeaders };
    },
    { urls: ["https://www.youtube.com/embed/*"], types: ["sub_frame"] },
    ["blocking", "requestHeaders"],
  );

  youtubeEmbedWebRequestFallbackRegistered = true;
};
