import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    chromiumArgs: ["https://youtube.com"],
    firefoxArgs: ["-new-tab", "https://youtube.com"],
  },
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: ({ browser }) => ({
    name: "LocalTube Manager",
    description: "A browser extension to use YouTube without a Google account",
    version: "5.1.1",
    action: {},
    permissions:
      browser === "firefox"
        ? [
            "unlimitedStorage",
            "alarms",
            "notifications",
            "webRequest",
            "webRequestBlocking",
          ]
        : [
            "unlimitedStorage",
            "alarms",
            "notifications",
            "declarativeNetRequestWithHostAccess",
          ],
    host_permissions: ["*://*.youtube.com/*"],
  }),
});
