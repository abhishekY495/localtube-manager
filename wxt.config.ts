import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "LocalTube-Manager",
    description: "A browser extension to use Youtube without a Google account",
    version: "5.0.0",
    permissions: ["unlimitedStorage", "alarms", "notifications"],
    host_permissions: ["*://*.youtube.com/*"],
  },
});
