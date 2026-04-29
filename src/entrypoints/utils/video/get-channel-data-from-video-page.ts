import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import type { Channel } from "../types";

export const getChannelDataFromVideoPage = async (): Promise<Channel> => {
  let channelHandle, channelName, channelImage;

  const channelNameFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_NAME_FROM_VIDEO_PAGE_ELEMENTS,
  );
  const channelHandleFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_HANDLE_FROM_VIDEO_PAGE_ELEMENTS,
  );
  //
  const channelCollaborationNamesFromVideoPageElement =
    await findElementBySelectors(
      SELECTORS.CHANNEL_COLLABORATION_NAMES_FROM_VIDEO_PAGE_ELEMENTS,
    );

  const channelImageFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_IMAGE_FROM_VIDEO_PAGE_ELEMENTS,
  );

  channelName =
    (channelNameFromVideoPageElement?.textContent?.trim() ||
      channelCollaborationNamesFromVideoPageElement?.textContent?.trim()) ??
    null;
  channelHandle =
    channelHandleFromVideoPageElement
      ?.getAttribute("href")
      ?.replace("/@", "") ?? null;
  channelImage =
    channelImageFromVideoPageElement
      ?.getAttribute("src")
      ?.replace("=s48", "=s175") ?? null;

  return {
    handle: channelHandle,
    name: channelName,
    image: channelImage,
    addedAt: new Date().toISOString(),
  };
};
