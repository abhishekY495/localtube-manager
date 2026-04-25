import "~/assets/tailwind.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { checkIfVideoIsLiked } from "../functions/checkIfVideoIsLiked";

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
      window.addEventListener("yt-navigate-finish", async () => {
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
