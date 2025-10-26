export async function getChannelDetailsFromChannelHandle(
  handle: string
): Promise<{
  channelId: string;
  channelImage: string;
  channelName: string;
} | null> {
  try {
    // Clean the handle - remove @ and full YouTube URLs
    let cleanHandle = handle
      .replace(/^@/, "")
      .replace(/^https?:\/\/www\.youtube\.com\/@/, "")
      .replace(/^https?:\/\/youtube\.com\/@/, "")
      .replace(/^www\.youtube\.com\/@/, "")
      .replace(/^youtube\.com\/@/, "");

    // Try to get channel ID from YouTube page
    const channelUrl = `https://www.youtube.com/@${cleanHandle}`;
    const response = await fetch(channelUrl);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Multiple patterns to find the channel ID - META TAG FIRST (most reliable)
    const channelIdPatterns = [
      /<meta itemprop="identifier" content="(UC[a-zA-Z0-9_-]{22})"/, // META TAG - PRIORITY 1
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
      /"browseId":"(UC[a-zA-Z0-9_-]{22})"/,
      /channel\/(UC[a-zA-Z0-9_-]{22})/,
      /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
      /data-channel-external-id="(UC[a-zA-Z0-9_-]{22})"/,
    ];

    let channelId: string | null = null;
    for (let i = 0; i < channelIdPatterns.length; i++) {
      const match = html.match(channelIdPatterns[i]);
      if (match) {
        channelId = match[1];
        break;
      }
    }

    if (!channelId) {
      return null;
    }

    // Extract channel image URL - try <link rel="image_src"> first, then <meta property="og:image">
    const imagePatterns = [
      /<link rel="image_src" href="(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/,
      /<meta property="og:image" content="(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/,
    ];

    let channelImage: string = "";
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

    let channelName: string = "";
    for (let i = 0; i < namePatterns.length; i++) {
      const match = html.match(namePatterns[i]);
      if (match) {
        channelName = match[1];
        break;
      }
    }

    return {
      channelId: `https://www.youtube.com/channel/${channelId}`,
      channelImage: channelImage?.replace("=s900", "=s176") || "",
      channelName,
    };
  } catch (error) {
    return null;
  }
}
