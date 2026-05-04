export const getThumbnailUrl = (urlSlug: string, isShort: boolean) => {
  if (isShort) {
    return `https://i.ytimg.com/vi/${urlSlug}/oar2.jpg`;
  }
  return `https://i.ytimg.com/vi/${urlSlug}/mqdefault.jpg`;
};
