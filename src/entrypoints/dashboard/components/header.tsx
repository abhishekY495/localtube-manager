import logo from "@/assets/logo.png";
import { WEBSITE_URL } from "@/entrypoints/utils/constants";

export const Header = () => {
  return (
    <div className="bg-neutral-900 flex items-center justify-center pb-3 pt-2 px-6 rounded w-fit mx-auto cursor-pointer">
      <a href={WEBSITE_URL} target="_blank" className="flex items-center gap-4">
        <img
          src={logo}
          alt="LocalTube Manager"
          className="rounded"
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
    </div>
  );
};
