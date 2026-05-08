import logo from "@/assets/logo.png";
import { WEBSITE_URL } from "@/entrypoints/utils/constants";

export const Header = () => {
  return (
    <a
      href={WEBSITE_URL}
      target="_blank"
      className="bg-neutral-900 flex items-center justify-center gap-2 p-2 px-5 rounded w-fit mx-auto cursor-pointer"
    >
      <img
        src={logo}
        alt="LocalTube Manager"
        className="rounded mt-0.5"
        width={18}
        height={18}
      />
      <p
        className="text-neutral-300"
        style={{ fontSize: "20px", fontWeight: 500 }}
      >
        LocalTube Manager
      </p>
    </a>
  );
};
