import { YoutubeChannel } from "@/entrypoints/types";

async function getChannelDetailsFromChannelHandle(channelUrl: string) {
  try {
    const response = await fetch(channelUrl);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract channel image URL - try <link rel="image_src"> first, then <meta property="og:image">
    const imagePatterns = [
      /<link rel="image_src" href="(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/,
      /<meta property="og:image" content="(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/,
    ];

    let channelImage = "";
    for (let i = 0; i < imagePatterns.length; i++) {
      const match = html.match(imagePatterns[i]);
      if (match) {
        channelImage = match[1];
        break;
      }
    }

    // Extract channel name - try meta tags first, then title tag
    const namePatterns = [
      /<meta property="og:title" content="([^"]+)"/,
      /<link itemprop="name" content="([^"]+)"/,
      /<meta itemprop="name" content="([^"]+)"/,
      /<meta property="og:video:tag" content="([^"]+)"/,
      /<title>([^<]+) - YouTube<\/title>/,
    ];

    let channelName = "";
    for (let i = 0; i < namePatterns.length; i++) {
      const match = html.match(namePatterns[i]);
      if (match) {
        channelName = match[1];
        break;
      }
    }

    // Extract channel handle (e.g., @mkbhd)
    const handlePatterns = [
      /"canonicalBaseUrl":"(\/@[^"]+)"/,
      /"vanityChannelUrl":"https?:\/\/www\.youtube\.com(\/@[^"]+)"/,
      /"ownerUrls":\["https?:\/\/www\.youtube\.com(\/@[^"]+)"/,
      /"url":"(\/@[^"]+)","webPageType":"WEB_PAGE_TYPE_CHANNEL"/,
      /"url":"(\/@[^"\/]+)\/featured"/,
    ];

    let channelHandle = "";
    for (let i = 0; i < handlePatterns.length; i++) {
      const match = html.match(handlePatterns[i]);
      if (match) {
        channelHandle = match[1];
        break;
      }
    }

    // Clean up the handle: remove leading "/" and any trailing paths like "/featured"
    if (channelHandle) {
      channelHandle = channelHandle.replace(/^\//, "").split("/")[0];
    }

    return {
      addedAt: new Date().toISOString(),
      handle: `https://www.youtube.com/${channelHandle}`,
      imageUrl: channelImage?.replace("=s900", "=s176"),
      name: channelName,
      id: channelUrl,
    };
  } catch (error) {
    return null;
  }
}

// Parse CSV and process all channel URLs
export async function googleCsvToJsonAll(csvContent: string) {
  try {
    // Read the CSV file
    const data = csvContent.split("\n").slice(1);
    const subscribedChannels: YoutubeChannel[] = [];
    for (let i = 0; i < data.length; i++) {
      const line = data[i];
      const channelUrl = line.split(",")[1];
      const channelData = await getChannelDetailsFromChannelHandle(channelUrl);
      if (channelData) {
        subscribedChannels.push(channelData);
      }
    }
    return subscribedChannels;
  } catch (error) {
    return null;
  }
}
