import { ACTIONS, WEBSITE_URL } from "../utils/constants";
import type { Message } from "../utils/types";
import logo from "@/assets/logo.png";

export const UpdateMessageModal = ({
  setShowUpdateMessage,
}: {
  setShowUpdateMessage: (show: boolean) => void;
}) => {
  const whatsNewButtonHandler = async () => {
    await browser.runtime.sendMessage({
      action: ACTIONS.UPDATE_SETTING,
      data: { key: "showUpdateMessage", value: false },
    } satisfies Message);
    window.open(WEBSITE_URL + "/whats-new/", "_blank");
    setShowUpdateMessage(false);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div
        className="border-2 border-neutral-800 bg-neutral-900 rounded-lg"
        style={{ width: "420px", marginTop: "-420px" }}
      >
        <div
          className="flex flex-col gap-2"
          style={{
            padding: "14px 20px 20px 20px",
          }}
        >
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="What's new"
              width={26}
              height={26}
              className="rounded"
            />
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "500",
              }}
            >
              New Update
            </h2>
          </div>
          <p
            className="text-neutral-400"
            style={{
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            LocalTube Manager has been updated with a new way to use it.
            Discover all the features and improvements in this major release.
          </p>
        </div>

        <div className="bg-neutral-800" style={{ padding: "12px" }}>
          <button
            className="bg-neutral-200 text-black rounded-lg cursor-pointer w-full"
            style={{
              fontSize: "16px",
              fontWeight: 500,
              padding: "8px",
            }}
            onClick={whatsNewButtonHandler}
          >
            What's new
          </button>
        </div>
      </div>
    </div>
  );
};
