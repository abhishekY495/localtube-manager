import { ACTIONS } from "@/entrypoints/utils/constants";
import type { Message } from "@/entrypoints/utils/types";
import toast from "react-hot-toast";

export const UnsubscribeChannelModal = ({
  setIsUnsubscribeModalOpen,
  channelId,
  onRefresh,
}: {
  setIsUnsubscribeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  channelId: string;
  onRefresh: () => void;
}) => {
  const unsubscribeButtonHandler = async () => {
    const response = await browser.runtime.sendMessage({
      action: ACTIONS.DELETE_SUBSCRIBED_CHANNEL_BY_ID,
      data: { channelId },
    } satisfies Message);
    if (response.success) {
      onRefresh();
      setIsUnsubscribeModalOpen(false);
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  };
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div
        className="border-2 border-neutral-800 bg-neutral-900 rounded-lg"
        style={{ width: "360px", marginTop: "-420px" }}
      >
        <div
          className="flex flex-col gap-2"
          style={{
            padding: "14px 16px 16px 16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            Are you sure?
          </h2>
          <p
            className="text-neutral-400"
            style={{
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            This action cannot be undone. This will permanently remove the
            subscribed channel.
          </p>
        </div>

        <div
          className="flex justify-end gap-5 bg-neutral-800"
          style={{ padding: "12px" }}
        >
          <button
            className="bg-neutral-700 rounded-lg cursor-pointer border border-neutral-600"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              paddingInline: "14px",
              paddingBlock: "4px",
            }}
            onClick={() => setIsUnsubscribeModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-neutral-200 text-black rounded-lg cursor-pointer"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              paddingInline: "14px",
              paddingBlock: "4px",
            }}
            onClick={unsubscribeButtonHandler}
          >
            Unsubscribe
          </button>
        </div>
      </div>
    </div>
  );
};
