import "~/assets/tailwind.css";
import youtubePageStyles from "~/assets/youtube-page.css?inline";
import { createRoot } from "react-dom/client";
import App from "./App";
import toast, { Toaster } from "react-hot-toast";
import { ACTIONS, LTM_TOAST_ROOT_ID } from "../utils/constants";
import { init } from "./functions/init";
import { wait } from "../utils/wait";
import {
  clearExistingCustomAddToLocalPlaylistButton,
  clearExistingCustomLikedButton,
  clearExistingCustomLocalPlaylistModal,
  clearExistingCustomSavePlaylistButton,
  clearExistingCustomSubscribeButtons,
} from "../utils/clear-existing-custom-buttons";
import type {
  GetSettingResponse,
  Message,
  Response,
} from "../utils/types";

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

    const extensionSettingsResponse: Response<GetSettingResponse> =
      await browser.runtime.sendMessage({
        action: ACTIONS.GET_SETTING,
        data: { key: "Extension" },
      } satisfies Message);
    if (!extensionSettingsResponse.success) {
      toast.error("Something went wrong,\n Refresh and try again");
      console.error("Failed to get settings:", extensionSettingsResponse.error);
      return;
    }

    const isExtensionEnabled = extensionSettingsResponse.data.value;

    if (!isExtensionEnabled) {
      return;
    }

    if (window.location.hostname.includes("youtube.com")) {
      const style = document.createElement("style");
      style.textContent = youtubePageStyles;
      document.documentElement.append(style);

      clearExistingCustomLikedButton();
      clearExistingCustomSubscribeButtons();
      clearExistingCustomSavePlaylistButton();
      clearExistingCustomAddToLocalPlaylistButton();
      clearExistingCustomLocalPlaylistModal();
      await init();
      window.addEventListener("yt-navigate-finish", async () => {
        await wait(1500);
        clearExistingCustomLikedButton();
        clearExistingCustomSubscribeButtons();
        clearExistingCustomSavePlaylistButton();
        clearExistingCustomAddToLocalPlaylistButton();
        clearExistingCustomLocalPlaylistModal();
        await init();
      });
    }
  },
});
