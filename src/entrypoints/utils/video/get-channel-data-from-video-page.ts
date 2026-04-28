import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";

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
  //
  const channelCollaborationNamesFromVideoPageElement =
    await findElementBySelectors(
      SELECTORS.CHANNEL_COLLABORATION_NAMES_FROM_VIDEO_PAGE_ELEMENTS,
    );

  channelName =
    channelNameFromVideoPageElement?.textContent?.trim() ||
    channelCollaborationNamesFromVideoPageElement?.textContent?.trim();

  channelHandle = channelHandleFromVideoPageElement
    ?.getAttribute("href")
    ?.replace("/@", "");

  return {
    channelHandle: channelHandle ?? null,
    channelName: channelName ?? null,
  };
};
