import { getFreshVideos, clearFreshVideos, markFreshVideoAsViewed, removeFreshVideo } from "../../indexedDB/freshVideo";
import { getSettings, saveSettings } from "../../indexedDB/settings";
import { getSubscribedChannels } from "../../indexedDB/channel";
import { FreshVideo } from "../../types";

export const renderFreshVideos = async () => {
  const container = document.getElementById("fresh-videos-container");
  if (!container) {
    return;
  }

  const freshVideos = await getFreshVideos();
  const settings = await getSettings();

  container.innerHTML = `
    <div class="fresh-videos-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #333;">
      <div></div>
      <div class="fresh-videos-controls" style="display: flex; gap: 10px; align-items: center;">
        <button id="refresh-fresh-videos" class="btn-secondary" style="padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease; background: #555; color: white;" onmouseover="this.style.background='#666'" onmouseout="this.style.background='#555'">🔄 Refresh</button>
        <button id="fresh-videos-settings" class="btn-settings" style="padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease; background: #6c757d; color: white;" onmouseover="this.style.background='#7b848c'" onmouseout="this.style.background='#6c757d'">⚙️</button>
      </div>
    </div>
    
    <div id="fresh-videos-settings-panel" class="settings-panel" style="display: none; background: #2a2a2a; border: 1px solid #555; border-radius: 8px; margin-bottom: 20px; padding: 0; overflow: hidden;">
      <div class="settings-content" style="padding: 20px;">
        <h3 style="margin: 0 0 20px 0; color: #fff; font-size: 18px;">Fresh Videos Settings</h3>
        <div class="setting-item" style="margin-bottom: 15px;">
          <label for="fetch-interval" style="display: block; margin-bottom: 5px; color: #ccc; font-weight: 500;">Fetch interval (minutes):</label>
          <input type="number" id="fetch-interval" value="${settings.freshVideosFetchInterval}" min="15" max="1440" style="width: 200px; padding: 8px 12px; background: #444; border: 1px solid #666; border-radius: 4px; color: white; font-size: 14px;">
        </div>
        <div class="settings-buttons" style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="save-settings" class="btn-primary" style="padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease; background: #007bff; color: white;" onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">Save</button>
          <button id="cancel-settings" class="btn-secondary" style="padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease; background: #555; color: white;" onmouseover="this.style.background='#666'" onmouseout="this.style.background='#555'">Cancel</button>
        </div>
      </div>
    </div>

    <div id="liked-videos-container">
      ${freshVideos.length === 0 
        ? '<p style="text-align: center; color: #888; font-size: 16px; padding: 40px 20px;">No fresh videos available. Make sure you have subscribed channels!</p>'
        : freshVideos.map((video, index) => renderFreshVideoItem(video, index)).join('')
      }
    </div>
  `;

  // Add event listeners
  setupFreshVideosEventListeners();
};

const renderFreshVideoItem = (video: FreshVideo, index: number): string => {
  const publishedDate = new Date(video.publishedAt).toLocaleDateString();

  return `
    <div class="liked-video" data-video-id="${video.urlSlug}">
      <div class="liked-video-index">${index + 1}</div>
      <div class="liked-video-container-1">
        <img src="${video.thumbnail}" alt="${video.title}" class="liked-video-thumbnail" loading="lazy" />
      </div>
      <div class="liked-video-container-2">
        <div class="liked-video-title" title="${video.title}">${video.title}</div>
        <div class="liked-video-channel-name">${video.channelName}</div>
        <div class="liked-video-channel-handle">${
          video.channelHandle?.includes("@")
            ? "@" + video.channelHandle?.split("@")[1]
            : video.channelHandle?.split("/")[4]
        } • ${publishedDate}</div>
        <button class="remove-btn" data-video-id="${video.urlSlug}">Remove</button>
      </div>
    </div>
  `;
};

const getTimeAgo = (publishedAt: string): string => {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
};

const updateFreshVideosCount = async () => {
  const freshVideosCount = document.querySelector("#fresh-videos-count") as HTMLElement;
  if (freshVideosCount) {
    const { getFreshVideosCount } = await import("../../indexedDB/freshVideo");
    const count = await getFreshVideosCount();
    freshVideosCount.innerText = (await import("numeral")).default(count).format("0a");
  }
};

const setupFreshVideosEventListeners = () => {
  // Refresh button
  const refreshBtn = document.getElementById("refresh-fresh-videos");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await refreshFreshVideos();
    });
  }

  // Settings button
  document.getElementById("fresh-videos-settings")?.addEventListener("click", () => {
    const panel = document.getElementById("fresh-videos-settings-panel");
    if (panel) {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    }
  });

  // Save settings
  document.getElementById("save-settings")?.addEventListener("click", async () => {
    const intervalInput = document.getElementById("fetch-interval") as HTMLInputElement;
    const saveBtn = document.getElementById("save-settings") as HTMLButtonElement;
    
    if (intervalInput && saveBtn) {
      const newInterval = parseInt(intervalInput.value);
      if (newInterval >= 15 && newInterval <= 1440) {
        // Show loading state
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "Saving...";
        saveBtn.disabled = true;
        
        try {
          const settings = await getSettings();
          settings.freshVideosFetchInterval = newInterval;
          await saveSettings(settings);
          
          // Update the background alarm with new interval
          await browser.runtime.sendMessage({
            task: "updateFreshVideosAlarm",
            data: {}
          });
          
          // Show success message
          saveBtn.textContent = "✓ Saved!";
          saveBtn.style.background = "#28a745";
          
          // Close panel after a short delay
          setTimeout(() => {
            const panel = document.getElementById("fresh-videos-settings-panel");
            if (panel) panel.style.display = "none";
            
            // Reset button
            saveBtn.textContent = originalText;
            saveBtn.style.background = "#007bff";
            saveBtn.disabled = false;
          }, 1000);
          
        } catch (error) {
          // Show error state
          saveBtn.textContent = "❌ Error";
          saveBtn.style.background = "#dc3545";
          
          setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = "#007bff";
            saveBtn.disabled = false;
          }, 2000);
        }
      } else {
        // Show validation error
        saveBtn.textContent = "Invalid value";
        saveBtn.style.background = "#dc3545";
        
        setTimeout(() => {
          saveBtn.textContent = "Save";
          saveBtn.style.background = "#007bff";
        }, 2000);
      }
    }
  });

  // Cancel settings
  document.getElementById("cancel-settings")?.addEventListener("click", async () => {
    // Reset input to current saved value
    const settings = await getSettings();
    const intervalInput = document.getElementById("fetch-interval") as HTMLInputElement;
    if (intervalInput) {
      intervalInput.value = settings.freshVideosFetchInterval.toString();
    }
    
    const panel = document.getElementById("fresh-videos-settings-panel");
    if (panel) panel.style.display = "none";
  });

  // Remove button
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation(); // Prevent row click
      const videoId = (e.target as HTMLElement).closest('.remove-btn')?.getAttribute("data-video-id");
      if (videoId) {
        await removeFreshVideo(videoId);
        await renderFreshVideos();
        await updateFreshVideosCount();
        // Update badge count
        const { FreshVideosService } = await import("../../background/freshVideosService");
        const service = new FreshVideosService();
        await service.updateBadgeCount();
      }
    });
  });

  // Click on video item to watch and remove
  document.querySelectorAll(".liked-video").forEach(item => {
    item.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      // Don't trigger if clicking on buttons or SVG
      if (target.tagName === 'BUTTON' || target.tagName === 'SVG' || target.tagName === 'PATH') return;
      
      const videoId = item.getAttribute("data-video-id");
      if (videoId) {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        window.open(url, "_blank");
        // Remove from list instead of marking as viewed
        await removeFreshVideo(videoId);
        await renderFreshVideos();
        await updateFreshVideosCount();
        // Update badge count
        const { FreshVideosService } = await import("../../background/freshVideosService");
        const service = new FreshVideosService();
        await service.updateBadgeCount();
      }
    });
  });
};

const refreshFreshVideos = async () => {
  try {
    const button = document.getElementById("refresh-fresh-videos");
    if (button) {
      button.textContent = "🔄 Refreshing...";
      button.setAttribute("disabled", "true");
    }

    const response = await browser.runtime.sendMessage({
      task: "fetchFreshVideos",
      data: {}
    });

    if (response.success) {
      await renderFreshVideos();
      await updateFreshVideosCount();
      if (button) {
        button.textContent = "🔄 Refresh";
        button.removeAttribute("disabled");
      }
    } else {
      if (button) {
        button.textContent = "❌ Error";
        setTimeout(() => {
          button.textContent = "🔄 Refresh";
          button.removeAttribute("disabled");
        }, 2000);
      }
    }
  } catch (error) {
    const button = document.getElementById("refresh-fresh-videos");
    if (button) {
      button.textContent = "❌ Error";
      setTimeout(() => {
        button.textContent = "🔄 Refresh";
        button.removeAttribute("disabled");
      }, 2000);
    }
  }
};

