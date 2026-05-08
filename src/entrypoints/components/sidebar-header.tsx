import { useState } from "react";
import logo from "@/assets/logo.png";
import { WEBSITE_URL } from "../utils/constants";
import { InfoIcon } from "lucide-react";
import { AboutModal } from "./about-modal";

export const SidebarHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="border-b border-neutral-700 bg-neutral-800 flex justify-center"
      style={{
        paddingBlock: "10px",
      }}
    >
      <a href={WEBSITE_URL} target="_blank" className="flex items-center gap-4">
        <img
          src={logo}
          alt="LocalTube Manager"
          className="rounded"
          width={18}
          height={18}
        />
        <p style={{ fontSize: "20px", fontWeight: 500 }}>LocalTube Manager</p>
      </a>
      <InfoIcon
        size={18}
        className="cursor-pointer absolute text-neutral-400"
        style={{ top: "16px", right: "10px" }}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && <AboutModal setIsOpen={setIsOpen} />}
    </header>
  );
};
