import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  srcDir: "src",
  manifest: {
    name: "LocalTube-Manager",
    description: "A browser extension to use Youtube without a Google account",
    version: "4.0.0",
    web_accessible_resources: [
      {
        matches: ["*://*.youtube.com/*"],
        resources: [
          "/animation/like-animation.json",
          "/animation/subscribe-animation.json",
        ],
      },
    ],
    permissions: ["unlimitedStorage", "alarms", "notifications"],
    host_permissions: ["*://*.youtube.com/*"],
  },
});
