import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/findElementBySelectors";

export const getChannelDataFromVideoPage = async (): Promise<{
  channelHandle: string | null;
  channelName: string | null;
}> => {
  let channelHandle, channelName;

  const channelNameFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_NAME_FROM_VIDEO_PAGE_ELEMENTS,
  );
  const channelHandleFromVideoPageElement = await findElementBySelectors(
    SELECTORS.CHANNEL_HANDLE_FROM_VIDEO_PAGE_ELEMENTS,
  );

  if (channelNameFromVideoPageElement) {
    channelName = channelNameFromVideoPageElement?.textContent?.trim();
  }
  if (channelHandleFromVideoPageElement) {
    channelHandle = channelHandleFromVideoPageElement
      ?.getAttribute("href")
      ?.replace("/@", "");
  }

  if (channelHandle && channelName) {
    return {
      channelHandle,
      channelName,
    };
  }

  return {
    channelHandle: null,
    channelName: null,
  };
};
