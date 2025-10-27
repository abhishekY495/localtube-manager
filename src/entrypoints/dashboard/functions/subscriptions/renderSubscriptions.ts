import { SubscribedChannelVideo } from "@/entrypoints/types";
import defaultVideoThumbnail from "../../assets/default-video-thumbnail.jpg";
import { formatTime } from "../../helpers/formatTime";

export function renderSubscriptions(
  subscribedChannelVideos: SubscribedChannelVideo[],
  subscribedChannelVideosContainer: HTMLElement,
  subscriptionsHeadingContainer: HTMLElement
) {
  subscribedChannelVideosContainer.innerHTML = "";
  if (subscribedChannelVideos.length === 0) {
    subscriptionsHeadingContainer.style.display = "none";
    subscribedChannelVideosContainer.innerHTML += `
      <p class="no-video-or-channel-message">
        Visit <a href="https://www.youtube.com" class="youtube">YouTube</a> to Subscribe channels
      </p>
    `;
  } else {
    subscriptionsHeadingContainer.style.display = "flex";
    subscribedChannelVideos
      .sort(
        (a, b) =>
          new Date(b?.uploadedAt)?.getTime() -
          new Date(a?.uploadedAt)?.getTime()
      )
      .map((video: SubscribedChannelVideo) => {
        const thumbnailUrl = video?.urlSlug?.includes("shorts")
          ? `https://i.ytimg.com/vi/${
              video?.urlSlug?.split("/shorts/")[1]
            }/oar2.jpg`
          : `https://i.ytimg.com/vi/${
              video?.urlSlug?.split("=")[1]
            }/mqdefault.jpg`;
        const uploadedAt = formatTime(video?.uploadedAt);

        subscribedChannelVideosContainer.innerHTML += `
        <div class="subscribed-channel-video">
          <a href="${video?.urlSlug}">
            <img 
              class="subscribed-channel-video-thumbnail"
              src="${thumbnailUrl}"
              alt="${video?.title}"
              onerror="this.onerror=null; this.src='${defaultVideoThumbnail}';"
            />
          </a>
          <div class="subscribed-channel-video-title-channel-name-uploaded-at-container">
            <p class="subscribed-channel-video-title" title="${video?.title}">${video?.title}</p>
            <div class="subscribed-channel-video-channel-name-uploaded-at-container">
              <p class="subscribed-channel-video-channel-name" title="${video?.channelName}">${video?.channelName}</p>
              <span>•</span>
              <p class="subscribed-channel-video-uploaded-at" title="${uploadedAt}">${uploadedAt}</p>
            </div>
          </div>
        </div>
        `;
      });
  }
}
