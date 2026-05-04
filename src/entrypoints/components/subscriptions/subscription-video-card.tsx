import { formatTime } from "@/entrypoints/utils/format-time";
import type { Subscription } from "@/entrypoints/utils/types";

export const SubscriptionVideoCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const videoUrl = `https://www.youtube.com/watch?v=${subscription.urlSlug}`;
  const videoThumbnail = `https://i.ytimg.com/vi/${subscription.urlSlug}/mqdefault.jpg`;
  const uploadedAt = formatTime(subscription.uploadedAt ?? "");

  return (
    <div className="flex flex-col ">
      <a href={videoUrl}>
        <img
          src={videoThumbnail}
          alt={subscription.title}
          className="rounded-t-2xl"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </a>
      {/*  */}
      <div className="flex flex-col bg-neutral-800" style={{ padding: "10px" }}>
        <a
          href={videoUrl}
          title={subscription.title}
          className="text-neutral-200"
          style={{
            fontSize: "15px",
            fontWeight: 500,
            width: "250px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subscription.title}
        </a>
        <div
          className="flex items-center gap-1.5 text-neutral-400"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          <p>{subscription.channelName}</p>
          <span>•</span>
          <p>{uploadedAt}</p>
        </div>
      </div>
    </div>
  );
};
