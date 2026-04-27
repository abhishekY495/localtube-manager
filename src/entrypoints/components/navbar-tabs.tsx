import { NAV_ITEMS } from "../utils/constants";
import type { NavItemLabel } from "../utils/constants";

export const NavbarTabs = ({
  setActiveItem,
  activeItem,
}: {
  setActiveItem: (item: NavItemLabel) => void;
  activeItem: NavItemLabel;
}) => {
  return (
    <nav
      className="flex items-center justify-around border-b border-neutral-700"
      style={{ gap: "8px", padding: "8px" }}
    >
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`flex items-center justify-center cursor-pointer border border-neutral-700 w-full ${
            activeItem === item.label
              ? "bg-neutral-300 text-black"
              : "hover:bg-neutral-800"
          }`}
          style={{
            gap: "6px",
            borderRadius: "4px",
            padding: "4px",
            paddingInline: "10px",
            paddingBottom: "6px",
          }}
          onClick={() => setActiveItem(item.label)}
        >
          <item.icon size={14} />
          <p className="font-medium" style={{ fontSize: "13px" }}>
            {item.label}
          </p>
        </div>
      ))}
    </nav>
  );
};
