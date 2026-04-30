import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import type { Channel } from "../types";

export const getChannelDataFromVideoPage = async (): Promise<Channel> => {
  let channelHandle,
    channelName,
    channelImage,
    channelId1,
    channelId2,
    finalChannelId;

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
  //
  channelHandle = channelHandleFromVideoPageElement?.getAttribute("href");
  if (channelHandle?.includes("@")) {
    channelHandle = channelHandle?.replace("/@", "") ?? null;
  } else {
    channelHandle = channelHandle?.replace("/channel/", "") ?? null;
  }
  //
  channelId1 = channelIdFromVideoPageElement1?.getAttribute("href");
  channelId2 = channelIdFromVideoPageElement2?.getAttribute("href");
  //
  channelImage =
    channelImageFromVideoPageElement
      ?.getAttribute("src")
      ?.replace("=s48", "=s160") ?? null;

  if (channelId1?.includes("@")) {
    finalChannelId =
      channelId2?.replace("/channel/", "")?.replace("/videos", "") ?? null;
  } else {
    finalChannelId = channelId1?.replace("/channel/", "") ?? null;
  }

  return {
    id: finalChannelId,
    handle: channelHandle,
    name: channelName,
    image: channelImage,
    addedAt: new Date().toISOString(),
  };
};
