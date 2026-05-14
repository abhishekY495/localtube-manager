import logo from "@/assets/logo.png";
import githubIcon from "@/assets/github-light-icon.svg";
import { EXTENSION_VERSION, WEBSITE_URL } from "@/entrypoints/utils/constants";

export const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-neutral-700/70 pb-1">
      <a
        href={WEBSITE_URL}
        target="_blank"
        className="flex items-center justify-center gap-2 p-2 pt-1 px-5 rounded cursor-pointer"
      >
        <img
          src={logo}
          alt="LocalTube Manager"
          className="rounded-xs"
          width={18}
          height={18}
        />
        <p className="text-neutral-200 text-lg font-medium">Dashboard </p>
        <span className="self-end text-neutral-400 text-xs mb-1 font-normal">
          v{EXTENSION_VERSION}
        </span>
      </a>
      {/*  */}
      <a
        href="https://github.com/abhishekY495/localtube-manager"
        target="_blank"
        className="flex items-center gap-2 bg-neutral-700/50 px-4 py-1.5 rounded-full mb-0.5"
      >
        <img src={githubIcon} alt="github" className="w-4 h-4" />
        <span className="text-neutral-200 text-sm font-medium">
          Star on GitHub
        </span>
      </a>
    </header>
  );
};
