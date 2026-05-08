import { registerYoutubeEmbedReferrerWebRequestFallback } from "./register-youtube-embed-referrer-web-request-fallback";
import { updateYoutubeEmbedReferrerRule } from "./update-youtube-embed-referrer-rule";

export const setupYoutubeEmbedReferrer = async () => {
  if (import.meta.env.BROWSER === "firefox") {
    registerYoutubeEmbedReferrerWebRequestFallback();
    return;
  }

  const ruleRegistered = await updateYoutubeEmbedReferrerRule();
  if (!ruleRegistered) {
    registerYoutubeEmbedReferrerWebRequestFallback();
  }
};
