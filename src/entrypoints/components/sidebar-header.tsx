import logo from "@/assets/logo.png";
import { WEBSITE_URL } from "../utils/constants";

export const SidebarHeader = () => {
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
    </header>
  );
};
