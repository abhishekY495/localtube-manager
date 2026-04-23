import "@/assets/tailwind.css";
import { createRoot } from "react-dom/client";
import App from "./App";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "ltm-sidebar",
      position: "inline",
      anchor: "body",
      append: "last",
      inheritStyles: true,
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
  },
});
