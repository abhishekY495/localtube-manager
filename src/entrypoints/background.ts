import { ACTIONS } from "./utils/constants";

export default defineBackground(() => {
  const action = browser.action || (browser as any).browserAction;

  action.onClicked.addListener((tab: any) => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, { action: ACTIONS.TOGGLE_SIDEBAR });
    }
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message.action === ACTIONS.OPEN_DASHBOARD) {
      browser.tabs.create({
        url: browser.runtime.getURL("/dashboard.html"),
      });
    }
  });
});
