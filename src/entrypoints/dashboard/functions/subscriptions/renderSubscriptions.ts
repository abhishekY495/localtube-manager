import { SubscribedChannelVideo } from "@/entrypoints/types";
import defaultVideoThumbnail from "../../assets/default-video-thumbnail.jpg";
import { formatTime } from "../../helpers/formatTime";

const BATCH_SIZE = 20;
let allSortedVideos: SubscribedChannelVideo[] = [];
let currentIndex = 0;
let isLoading = false;
let observer: IntersectionObserver | null = null;
let currentFilter: "videos" | "shorts" = "videos";

function createVideoElement(video: SubscribedChannelVideo): string {
  const thumbnailUrl = video?.urlSlug?.includes("shorts")
    ? `https://i.ytimg.com/vi/${video?.urlSlug?.split("/shorts/")[1]}/oar2.jpg`
    : `https://i.ytimg.com/vi/${video?.urlSlug?.split("=")[1]}/mqdefault.jpg`;
  const uploadedAt = formatTime(video?.uploadedAt);

  return `
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
}

function createShortsElement(video: SubscribedChannelVideo): string {
  const thumbnailUrl = video?.urlSlug?.includes("shorts")
    ? `https://i.ytimg.com/vi/${video?.urlSlug?.split("/shorts/")[1]}/oar2.jpg`
    : `https://i.ytimg.com/vi/${video?.urlSlug?.split("=")[1]}/mqdefault.jpg`;
  const uploadedAt = formatTime(video?.uploadedAt);

  return `
    <div class="subscribed-channel-video">
      <a href="${video?.urlSlug}">
        <img 
          class="subscribed-channel-shorts-thumbnail"
          src="${thumbnailUrl}"
          alt="${video?.title}"
          onerror="this.onerror=null; this.src='${defaultVideoThumbnail}';"
        />
      </a>
      <div class="subscribed-channel-video-title-channel-name-uploaded-at-container">
        <p class="subscribed-channel-shorts-title" title="${video?.title}">${video?.title}</p>
      </div>
    </div>
  `;
}

function renderBatch(
  subscribedChannelVideosContainer: HTMLElement,
  append: boolean = false,
): void {
  if (isLoading) return;

  isLoading = true;
  const endIndex = Math.min(currentIndex + BATCH_SIZE, allSortedVideos.length);
  const batch = allSortedVideos.slice(currentIndex, endIndex);

  if (!append) {
    subscribedChannelVideosContainer.innerHTML = "";
  }

  // Remove sentinel if it exists
  const existingSentinel = subscribedChannelVideosContainer.querySelector(
    ".subscriptions-sentinel",
  );
  if (existingSentinel) {
    existingSentinel.remove();
  }

  // Render batch
  batch.forEach((video) => {
    const element =
      currentFilter === "shorts"
        ? createShortsElement(video)
        : createVideoElement(video);
    subscribedChannelVideosContainer.innerHTML += element;
  });

  currentIndex = endIndex;

  // Add sentinel element if there are more videos
  if (currentIndex < allSortedVideos.length) {
    const sentinel = document.createElement("div");
    sentinel.className = "subscriptions-sentinel";
    sentinel.style.height = "1px";
    subscribedChannelVideosContainer.appendChild(sentinel);

    // Observe the sentinel
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          currentIndex < allSortedVideos.length
        ) {
          isLoading = false;
          renderBatch(subscribedChannelVideosContainer, true);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
  }

  isLoading = false;
}

export function renderSubscriptions(
  subscribedChannelVideos: SubscribedChannelVideo[],
  subscribedChannelVideosContainer: HTMLElement,
  subscriptionsHeadingContainer: HTMLElement,
  filter: "videos" | "shorts" = "videos",
) {
  // Reset state
  currentIndex = 0;
  isLoading = false;
  currentFilter = filter;
  if (observer) {
    observer.disconnect();
    observer = null;
  }

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

    // Filter videos based on type
    let filteredVideos: SubscribedChannelVideo[];
    if (filter === "shorts") {
      filteredVideos = subscribedChannelVideos.filter((video) =>
        video?.urlSlug?.includes("www.youtube.com/shorts"),
      );
    } else {
      filteredVideos = subscribedChannelVideos.filter(
        (video) => !video?.urlSlug?.includes("www.youtube.com/shorts"),
      );
    }

    // Sort all videos once
    allSortedVideos = filteredVideos.sort(
      (a, b) =>
        new Date(b?.uploadedAt)?.getTime() - new Date(a?.uploadedAt)?.getTime(),
    );

    // Render first batch
    renderBatch(subscribedChannelVideosContainer, false);
  }
}
