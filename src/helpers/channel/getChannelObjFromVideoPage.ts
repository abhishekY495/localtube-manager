import { YoutubeChannel } from "../../types";

export function getChannelObjFromVideoPage(aboveTheFoldElement: HTMLElement) {
  const ownerElement = aboveTheFoldElement.querySelector(
    "#owner"
  ) as HTMLElement;
  const videoOwnerRendererElement = ownerElement.querySelector(
    "ytd-video-owner-renderer"
  ) as HTMLElement;
  const socialLinksElement = aboveTheFoldElement.querySelector(
    "#social-links"
  ) as HTMLElement;

  const channelSocialLinks = socialLinksElement.querySelectorAll("a");
  const channelId1 = channelSocialLinks[0];

  const channelLinks = videoOwnerRendererElement.querySelectorAll("a");
  const channelHandle = channelLinks[0];
  const channelId2 = channelLinks[1];

  const imageElement = channelHandle.querySelector("img") as HTMLElement;
  const imageUrl = imageElement.getAttribute("src") || "";

  const channel: YoutubeChannel = {
    name: channelId2?.innerText,
    handle: channelHandle?.href,
    id: channelId1?.href?.replace("/videos", "") || channelId2.href,
    imageUrl:
      imageUrl?.replace("=s48", "=s400") ||
      "https://raw.githubusercontent.com/abhishekY495/no-login-yt-images/refs/heads/main/default-channel-image.png?token=GHSAT0AAAAAACPOFNMWHBQPLRRRCPN7GTJWZ2BXGOQ",
    addedAt: new Date().toISOString(),
  };

  return channel;
}
