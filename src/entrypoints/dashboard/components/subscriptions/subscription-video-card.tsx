import { formatTime } from "@/entrypoints/utils/format-time";
import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";
import type { Subscription } from "@/entrypoints/utils/types";

export const SubscriptionVideoCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const videoUrl = `https://www.youtube.com/watch?v=${subscription.urlSlug}`;
  const videoThumbnail = getThumbnailUrl(
    subscription.urlSlug,
    subscription.isShort,
  );
  const uploadedAt = formatTime(subscription.uploadedAt ?? "");

  return (
    <div className="flex flex-col">
      <a href={videoUrl}>
        <img
          src={videoThumbnail}
          alt={subscription.title}
          className="rounded-t w-full object-cover"
        />
      </a>
      {/*  */}
      <div className="flex flex-col bg-neutral-800 p-2.5 pt-1.5">
        <a
          href={videoUrl}
          title={subscription.title}
          className="text-neutral-200 truncate text-base font-medium"
        >
          {subscription.title}
        </a>
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
          <p>{subscription.channelName}</p>
          <span>•</span>
          <p>{uploadedAt}</p>
        </div>
      </div>
    </div>
  );
};
