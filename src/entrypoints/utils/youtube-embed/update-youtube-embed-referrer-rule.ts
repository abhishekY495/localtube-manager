import { YOUTUBE_EMBED_REFERRER_RULE_ID } from "../constants";
import { getYoutubeEmbedReferrer } from "./get-youtube-embed-referrer";

export const updateYoutubeEmbedReferrerRule = async () => {
  const declarativeNetRequest = browser.declarativeNetRequest;
  if (!declarativeNetRequest) {
    return false;
  }

  await declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [YOUTUBE_EMBED_REFERRER_RULE_ID],
    addRules: [
      {
        id: YOUTUBE_EMBED_REFERRER_RULE_ID,
        priority: 1,
        condition: {
          initiatorDomains: [browser.runtime.id],
          requestDomains: ["www.youtube.com"],
          resourceTypes: ["sub_frame"],
        },
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "Referer",
              operation: "set",
              value: getYoutubeEmbedReferrer(),
            },
          ],
        },
      },
    ],
  });

  return true;
};
