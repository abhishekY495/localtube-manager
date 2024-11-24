let observer: MutationObserver | null = null;

export async function getChannelHandleAndId() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  let channelHandle = null;
  let channelId = null;

  setTimeout(() => {
    observer = new MutationObserver(() => {
      const aboveTheFoldElement = document.querySelector(
        "#above-the-fold"
      ) as HTMLElement;
      if (aboveTheFoldElement === null) {
        console.log("aboveTheFoldElement not found");
        return;
      }
      // console.log(aboveTheFoldElement);

      const ownerElement = aboveTheFoldElement.querySelector(
        "#owner"
      ) as HTMLElement;
      if (ownerElement === null) {
        console.log("ownerElement not found");
        return;
      }
      // console.log(ownerElement);

      const videoOwnerRendererElement = ownerElement.querySelector(
        "ytd-video-owner-renderer"
      ) as HTMLElement;
      if (videoOwnerRendererElement === null) {
        console.log("videoOwnerRendererElement not found");
        return;
      }
      // console.log(videoOwnerRendererElement);

      const socialLinksElement = aboveTheFoldElement.querySelector(
        "#social-links"
      ) as HTMLElement;
      if (socialLinksElement === null) {
        console.log("socialLinksElement not found");
        return;
      }
      // console.log(socialLinksElement);

      const channelSocialLinks = socialLinksElement.querySelectorAll("a");
      const channelIdElement1 = channelSocialLinks[0];

      const channelLinks = videoOwnerRendererElement.querySelectorAll("a");
      const channelHandleElement = channelLinks[0];
      const channelIdElement2 = channelLinks[1];

      observer?.disconnect();

      channelHandle = channelHandleElement?.href;
      channelId =
        channelIdElement1?.href?.replace("/videos", "") ||
        channelIdElement2.href;
    });
    console.log("searching for channel details");
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1800);

  return {
    channelHandle,
    channelId,
  };
}
