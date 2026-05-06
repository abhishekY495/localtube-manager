import { XIcon } from "lucide-react";
import starIcon from "@/assets/star-icon.svg";
import githubIcon from "@/assets/github-icon.svg";
import {
  CHROME_WEB_STORE_URL,
  EXTENSION_VERSION,
  FIREFOX_ADDON_STORE_URL,
  GITHUB_URL,
} from "../utils/constants";

export const AboutModal = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const browser = import.meta.env.BROWSER;
  const isChrome = browser === "chrome";

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="border-2 border-neutral-800 bg-neutral-900 rounded-lg"
        style={{ width: "380px", marginTop: "-380px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div
            className="border-b border-neutral-700 flex justify-between items-center"
            style={{ padding: "12px 16px" }}
          >
            <p style={{ fontSize: "18px", fontWeight: "500" }}>About</p>
            <p
              className="text-neutral-500"
              style={{ fontSize: "14px", fontWeight: "500" }}
            >
              v{EXTENSION_VERSION}
            </p>
          </div>
          {/*  */}
          <div className="flex flex-col gap-2" style={{ padding: "12px 16px" }}>
            <p
              className="text-neutral-300"
              style={{
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              A browser extension to use YouTube without a Google account.
              Completely free and open source.
              <br />
              <br /> Like videos, subscribe to channels, get notifications for
              new videos and create/manage playlists all without a Google
              account. <br />
              <br /> Your data stays private stored locally in your browser.
            </p>
          </div>
        </div>
        {/*  */}
        <div
          className="flex gap-5 bg-neutral-800"
          style={{ padding: "12px 12px 14px 12px" }}
        >
          <a
            href={isChrome ? CHROME_WEB_STORE_URL : FIREFOX_ADDON_STORE_URL}
            target="_blank"
            className="bg-neutral-300 text-black rounded-lg cursor-pointer flex items-center gap-2"
            style={{ padding: "4px 10px" }}
          >
            <img
              src={starIcon}
              alt="Star"
              width={14}
              height={14}
              style={{ marginTop: "-1px" }}
            />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>
              {isChrome
                ? "Rate on Chrome Web Store"
                : "Rate on Firefox Add-ons"}
            </p>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            className="bg-neutral-300 text-black rounded-lg cursor-pointer flex items-center gap-2"
            style={{ padding: "4px 10px" }}
          >
            <img
              src={githubIcon}
              alt="GitHub"
              width={14}
              height={14}
              style={{ marginTop: "-1px" }}
            />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>GitHub</p>
          </a>
        </div>
      </div>
    </div>
  );
};
