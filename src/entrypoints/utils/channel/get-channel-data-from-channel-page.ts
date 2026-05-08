import { SELECTORS } from "../constants";
import { findElementBySelectors } from "../find-element-by-selectors";
import type { Channel } from "../types";

export const getChannelDataFromChannelPage = async (
  channelId: string,
): Promise<Channel> => {
  let channelHandle, channelImage;

  const channelName = document.title.replace(" - YouTube", "");

  const channelHandleFromChannelPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_HANDLE_FROM_CHANNEL_PAGE_ELEMENTS,
  );
  channelHandle =
    channelHandleFromChannelPageElement?.textContent
      .match(/@\w+/)?.[0]
      .replace("@", "") ?? null;

  const channelImageFromChannelPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_IMAGE_FROM_CHANNEL_PAGE_ELEMENTS,
  );
  channelImage =
    channelImageFromChannelPageElement?.getAttribute("src") ?? null;

  return {
    id: channelId,
    name: channelName,
    handle: channelHandle,
    image: channelImage,
    addedAt: new Date().toISOString(),
  };
};
