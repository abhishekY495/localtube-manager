import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import type { Channel } from "../types";

export const getChannelDataFromVideoPage = async (): Promise<Channel> => {
  let channelHandle, channelName, channelImage, channelId;

  // name
  const channelNameFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_NAME_FROM_VIDEO_PAGE_ELEMENTS,
  );
  const channelCollaborationNamesFromVideoPageElement =
    await findElementBySelectors(
      SELECTORS.CHANNEL_COLLABORATION_NAMES_FROM_VIDEO_PAGE_ELEMENTS,
    );
  // handle
  const channelHandleFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_HANDLE_FROM_VIDEO_PAGE_ELEMENTS,
  );
  // id
  const channelIdFromVideoPageElement1 = await findElementBySelectors(
    SELECTORS.CHANNEL_ID_FROM_VIDEO_PAGE_ELEMENTS_1,
  );
  const channelIdFromVideoPageElement2 = await findElementBySelectors(
    SELECTORS.CHANNEL_ID_FROM_VIDEO_PAGE_ELEMENTS_2,
  );
  // image
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
  channelId =
    channelIdFromVideoPageElement1
      ?.getAttribute("href")
      ?.replace("/channel/", "") ||
    channelIdFromVideoPageElement2
      ?.getAttribute("href")
      ?.replace("/channel/", "")
      ?.replace("/videos", "") ||
    null;
  channelImage =
    channelImageFromVideoPageElement
      ?.getAttribute("src")
      ?.replace("=s48", "=s175") ?? null;

  return {
    id: channelId,
    handle: channelHandle,
    name: channelName,
    image: channelImage,
    addedAt: new Date().toISOString(),
  };
};
