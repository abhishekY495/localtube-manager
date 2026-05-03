import type { Subscription } from "@/entrypoints/utils/types";

export const SubscriptionShortCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const shortUrl = `https://www.youtube.com/shorts/${subscription.urlSlug}`;
  const shortThumbnail = `https://i.ytimg.com/vi/${subscription.urlSlug}/oardefault.jpg`;

  return (
    <div
      className="flex flex-col"
      style={{
        height: "420px",
      }}
    >
      <a href={shortUrl}>
        <img
          title={subscription.title}
          src={shortThumbnail}
          alt={subscription.title}
          className="rounded-t-2xl"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </a>
      <div
        className="flex flex-1 flex-col bg-neutral-800"
        style={{ padding: "10px", height: "100%" }}
      >
        <a
          title={subscription.title}
          href={shortUrl}
          className="text-neutral-200"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            width: "170px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subscription.title}
        </a>
        <p className="text-neutral-400" style={{ fontSize: "13px" }}>
          {subscription.channelName}
        </p>
      </div>
    </div>
  );
};
