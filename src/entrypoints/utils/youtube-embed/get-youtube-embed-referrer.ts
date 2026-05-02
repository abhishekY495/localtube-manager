export const getYoutubeEmbedReferrer = () => {
  const extensionId = browser.runtime.id
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `https://localtube-manager.${extensionId || "extension"}/`;
};
