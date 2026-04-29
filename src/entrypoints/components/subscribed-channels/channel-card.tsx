import type { Channel } from "@/entrypoints/utils/types";

export const ChannelCard = ({ channel }: { channel: Channel }) => {
  if (!channel.id || !channel.handle || !channel.image || !channel.name) {
    return null;
  }

  let channelUrl, channelHandle;

  if (channel.handle.includes("UC")) {
    channelUrl = `https://www.youtube.com/channel/${channel.id}`;
    channelHandle = channel.id;
  } else {
    channelUrl = `https://www.youtube.com/@${channel.handle}`;
    channelHandle = `@${channel.handle}`;
  }

  return (
    <a
      href={channelUrl}
      className="flex flex-col gap-4 items-center justify-center bg-neutral-800 rounded-2xl"
      style={{
        paddingBlock: "36px",
      }}
    >
      <img
        src={channel.image}
        alt={channel.name}
        width={120}
        className="rounded-full"
      />
      <div className="flex flex-col items-center justify-center -space-y-1">
        <p
          title={channel.name}
          style={{
            fontSize: "18px",
            textAlign: "center",
            width: "180px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {channel.name}
        </p>
        <p
          title={channelHandle}
          className="text-neutral-400"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          {channelHandle}
        </p>
      </div>
      <button
        className="bg-neutral-700 text-neutral-300 border rounded-full border-neutral-600 cursor-pointer hover:bg-neutral-600"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          padding: "4px 18px",
        }}
      >
        Unsubscribe
      </button>
    </a>
  );
};
