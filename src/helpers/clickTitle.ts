export function clickTitle() {
  const videoTitle = document.querySelector(
    "yt-formatted-string"
  ) as HTMLElement;
  if (videoTitle) {
    videoTitle.click();
  }
}
