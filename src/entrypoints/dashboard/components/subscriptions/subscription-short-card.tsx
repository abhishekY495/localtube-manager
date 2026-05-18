import { formatTime } from "@/entrypoints/utils/format-time";
import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";
import type { Subscription } from "@/entrypoints/utils/types";

export const SubscriptionShortCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const shortUrl = `https://www.youtube.com/shorts/${subscription.urlSlug}`;
  const shortThumbnail = getThumbnailUrl(subscription.urlSlug, true);
  const uploadedAt = formatTime(subscription.uploadedAt ?? "");

  return (
    <div className="flex flex-col">
      <a href={shortUrl}>
        <img
          title={subscription.title}
          src={shortThumbnail}
          alt={subscription.title}
          className="rounded-t w-full object-cover"
        />
      </a>
      {/*  */}
      <div className="flex flex-col bg-neutral-800 p-2.5 pt-1.5">
        <a
          title={subscription.title}
          href={shortUrl}
          className="text-neutral-200 truncate text-base font-medium"
        >
          {subscription.title}
        </a>
        <p className="text-neutral-400 text-xs font-medium">
          {subscription.channelName}
        </p>
        <p className="text-neutral-400 text-xs font-medium mt-0.5">
          {uploadedAt}
        </p>
      </div>
    </div>
  );
};
