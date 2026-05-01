import "~/assets/tailwind.css";
import youtubePageStyles from "~/assets/youtube-page.css?inline";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { LTM_TOAST_ROOT_ID } from "../utils/constants";
import { init } from "./functions/init";
import { wait } from "../utils/wait";
import {
  clearExistingCustomAddToLocalPlaylistButton,
  clearExistingCustomLikedButton,
  clearExistingCustomSavePlaylistButton,
  clearExistingCustomSubscribeButtons,
} from "../utils/clear-existing-custom-buttons";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // Remove existing toast root
    document.getElementById(LTM_TOAST_ROOT_ID)?.remove();

    // Create new toast root and render it
    const toasterHost = document.createElement("div");
    toasterHost.id = LTM_TOAST_ROOT_ID;
    document.body.append(toasterHost);
    const toasterRoot = createRoot(toasterHost);
    toasterRoot.render(
      <Toaster
        position="bottom-left"
        reverseOrder={true}
        containerStyle={{
          zIndex: 2147483647,
        }}
      />,
    );

    // Create sidebar and mount it
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
        toasterRoot.unmount();
        toasterHost.remove();
      },
    });
    ui.mount();

    if (window.location.hostname.includes("youtube.com")) {
      const style = document.createElement("style");
      style.textContent = youtubePageStyles;
      document.documentElement.append(style);

      clearExistingCustomLikedButton();
      clearExistingCustomSubscribeButtons();
      clearExistingCustomSavePlaylistButton();
      clearExistingCustomAddToLocalPlaylistButton();
      await init();
      window.addEventListener("yt-navigate-finish", async () => {
        await wait(1500);
        clearExistingCustomLikedButton();
        clearExistingCustomSubscribeButtons();
        clearExistingCustomSavePlaylistButton();
        clearExistingCustomAddToLocalPlaylistButton();
        await init();
      });
    }
  },
});
