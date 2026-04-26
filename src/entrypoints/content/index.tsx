import "~/assets/tailwind.css";
import youtubePageStyles from "~/assets/youtube-page.css?inline";
import { createRoot } from "react-dom/client";
import App from "./App";
import { checkIfVideoIsLiked } from "./functions/video/check-if-video-is-liked";
import { wait } from "../utils/wait";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "ltm-sidebar",
      position: "inline",
      anchor: "body",
      append: "last",
      onMount: (container) => {
        const wrapper = document.createElement("section");
        container.append(wrapper);
        const root = createRoot(wrapper);
        root.render(<App />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });
    ui.mount();

    if (window.location.hostname.includes("youtube.com")) {
      const style = document.createElement("style");
      style.textContent = youtubePageStyles;
      document.documentElement.append(style);

      window.addEventListener("yt-navigate-finish", async () => {
        await wait(1500);
        const url = new URL(window.location.href);

        const params = new URLSearchParams(url.search);
        const videoId = params.get("v");

        console.log(videoId);

        if (videoId) {
          checkIfVideoIsLiked(videoId);
        }
      });
    }
  },
});
