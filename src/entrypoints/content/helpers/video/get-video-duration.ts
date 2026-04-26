import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/findElementBySelectors";

export const getVideoDuration = async (): Promise<string | null> => {
  const videoDurationElement = await findElementBySelectors(
    SELECTORS.VIDEO_DURATION_ELEMENTS,
  );

  if (videoDurationElement) {
    return videoDurationElement.textContent;
  }

  return null;
};
