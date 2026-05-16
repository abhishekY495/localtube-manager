import type { Channel } from "@/entrypoints/utils/types";
import { useState } from "react";
import { UnsubscribeChannelModal } from "./unsubscribe-channel-modal";

export const ChannelCard = ({
  channel,
  onRefresh,
}: {
  channel: Channel;
  onRefresh: () => void;
}) => {
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
  let channelUrl, channelHandle;

  if (!channel.id || !channel.handle || !channel.image || !channel.name) {
    return null;
  }

  if (channel.handle.includes("UC")) {
    channelUrl = `https://www.youtube.com/channel/${channel.id}`;
    channelHandle = channel.id;
  } else {
    channelUrl = `https://www.youtube.com/@${channel.handle}`;
    channelHandle = channel.handle;
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center bg-neutral-900 rounded py-10">
        <a href={channelUrl}>
          <img
            src={channel.image}
            alt={channel.name}
            width={120}
            className="rounded-full"
          />
        </a>
        <a
          href={channelUrl}
          className="flex flex-col items-center justify-center"
        >
          <p
            title={channel.name}
            className="text-lg font-medium text-center truncate w-52"
          >
            {channel.name}
          </p>
          <p
            className="text-neutral-400 text-xs font-medium"
            title={channelHandle}
          >
            @{channelHandle}
          </p>
        </a>
        <button
          className="bg-neutral-800 text-neutral-300 border rounded-full p-1 pb-1.5 px-4 text-sm font-medium border-neutral-600 cursor-pointer hover:bg-neutral-700"
          onClick={() => setIsUnsubscribeModalOpen(true)}
        >
          Unsubscribe
        </button>
      </div>
      {isUnsubscribeModalOpen && (
        <UnsubscribeChannelModal
          setIsUnsubscribeModalOpen={setIsUnsubscribeModalOpen}
          channelId={channel.id}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
