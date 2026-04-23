import { ACTIONS } from "./utils/constants";

export default defineBackground(() => {
  browser.action.onClicked.addListener((tab) => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, { action: ACTIONS.TOGGLE_SIDEBAR });
    }
  });
});
