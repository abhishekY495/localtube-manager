import { FreshVideo } from "../types";
import { getSubscribedChannels } from "../indexedDB/channel";
import { addFreshVideos, cleanupOldFreshVideos } from "../indexedDB/freshVideo";
import { updateLastFetchTime } from "../indexedDB/settings";

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
}

export class FreshVideosService {
  private static instance: FreshVideosService;
  
  public static getInstance(): FreshVideosService {
    if (!FreshVideosService.instance) {
      FreshVideosService.instance = new FreshVideosService();
    }
    return FreshVideosService.instance;
  }

  async getChannelIdFromHandle(handle: string): Promise<string | null> {
    try {
      // Clean the handle - remove @ and full YouTube URLs
      let cleanHandle = handle
        .replace(/^@/, '')
        .replace(/^https?:\/\/www\.youtube\.com\/@/, '')
        .replace(/^https?:\/\/youtube\.com\/@/, '')
        .replace(/^www\.youtube\.com\/@/, '')
        .replace(/^youtube\.com\/@/, '');
      
      // Try to get channel ID from YouTube page
      const channelUrl = `https://www.youtube.com/@${cleanHandle}`;
      const response = await fetch(channelUrl);
      
      if (!response.ok) {
        return null;
      }
      
      const html = await response.text();
      
      // Multiple patterns to find the channel ID - META TAG FIRST (most reliable)
      const patterns = [
        /<meta itemprop="identifier" content="(UC[a-zA-Z0-9_-]{22})"/, // META TAG - PRIORITY 1
        /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
        /"browseId":"(UC[a-zA-Z0-9_-]{22})"/,
        /channel\/(UC[a-zA-Z0-9_-]{22})/,
        /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
        /data-channel-external-id="(UC[a-zA-Z0-9_-]{22})"/
      ];
      
      for (let i = 0; i < patterns.length; i++) {
        const match = html.match(patterns[i]);
        if (match) {
          return match[1];
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async fetchChannelRSS(channelId: string): Promise<RSSItem[]> {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await fetch(rssUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const entries = xmlDoc.querySelectorAll("entry");
      const items: RSSItem[] = [];
      
      entries.forEach(entry => {
        const titleElement = entry.querySelector("title");
        const linkElement = entry.querySelector("link");
        const publishedElement = entry.querySelector("published");
        const authorElement = entry.querySelector("author name");
        
        if (titleElement && linkElement && publishedElement && authorElement) {
          items.push({
            title: titleElement.textContent || "",
            link: linkElement.getAttribute("href") || "",
            pubDate: publishedElement.textContent || "",
            author: authorElement.textContent || ""
          });
        }
      });
      
      return items;
    } catch (error) {
      return [];
    }
  }

  extractVideoIdFromUrl(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }



  async fetchAllChannelsFreshVideos(): Promise<void> {
    try {
      const subscribedChannels = await getSubscribedChannels();
      
      const allFreshVideos: FreshVideo[] = [];
      const allValidVideoIds: string[] = [];

      for (const channel of subscribedChannels) {
        let channelId = channel.id;
        
        // Clean the channel ID if it contains a full URL
        if (channelId && channelId.includes('youtube.com/channel/')) {
          const match = channelId.match(/channel\/(UC[a-zA-Z0-9_-]{22})/);
          if (match) {
            channelId = match[1];
            // Update the cleaned ID in the database
            const { updateChannelId } = await import("../indexedDB/channel");
            await updateChannelId(channel.handle, channelId);
          }
        }
        
        // If no channel ID, try to get it from the handle
        if (!channelId && channel.handle) {
          channelId = await this.getChannelIdFromHandle(channel.handle);
          
          // Update the channel in the database with the found ID
          if (channelId) {
            const { updateChannelId } = await import("../indexedDB/channel");
            await updateChannelId(channel.handle, channelId);
          }
        }
        
        if (!channelId) {
          continue;
        }

        const rssItems = await this.fetchChannelRSS(channelId);

        for (const item of rssItems) {
          const videoId = this.extractVideoIdFromUrl(item.link);
          if (!videoId) continue;

          // Check if video was previously removed by user
          const { isVideoRemoved } = await import("../indexedDB/freshVideo");
          const wasRemoved = await isVideoRemoved(videoId);
          if (wasRemoved) {
            continue;
          }

          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          
          const freshVideo: FreshVideo = {
            urlSlug: videoId,
            title: item.title,
            duration: "", // Not used for fresh videos
            channelName: item.author,
            channelHandle: channel.handle,
            channelId: channel.id,
            thumbnail: thumbnailUrl,
            publishedAt: item.pubDate,
            addedAt: new Date().toISOString(),
            isViewed: false
          };

          allFreshVideos.push(freshVideo);
          allValidVideoIds.push(videoId);
        }

        // Add a small delay between channels to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Clean up videos that are no longer in any RSS feed
      await cleanupOldFreshVideos(allValidVideoIds);

      // Add all fresh videos to the database
      if (allFreshVideos.length > 0) {
        await addFreshVideos(allFreshVideos);
      }

      // Update last fetch time
      await updateLastFetchTime();

      // Update badge count
      await this.updateBadgeCount();

    } catch (error) {
      // Silent error handling
    }
  }

  async updateBadgeCount(): Promise<void> {
    try {
      const { getUnviewedFreshVideosCount } = await import("../indexedDB/freshVideo");
      const count = await getUnviewedFreshVideosCount();
      
      // Try different badge APIs (Firefox vs Chrome)
      const badgeApi = browser.action || browser.browserAction;
      
      if (badgeApi && badgeApi.setBadgeText) {
        if (count > 0) {
          await badgeApi.setBadgeText({ text: count.toString() });
          if (badgeApi.setBadgeBackgroundColor) {
            await badgeApi.setBadgeBackgroundColor({ color: "#FF0000" });
          }
        } else {
          await badgeApi.setBadgeText({ text: "" });
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }
}