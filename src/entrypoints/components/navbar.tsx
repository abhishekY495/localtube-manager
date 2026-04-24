import { NAV_ITEMS } from "../utils/constants";

export const Navbar = ({
  setActiveItem,
  activeItem,
}: {
  setActiveItem: (item: string) => void;
  activeItem: string;
}) => {
  return (
    <nav className="flex items-center justify-around" style={{ gap: "8px" }}>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`flex items-center justify-center w-full cursor-pointer border border-neutral-700 ${
            activeItem === item.label
              ? "bg-neutral-300 text-black"
              : "hover:bg-neutral-800"
          }`}
          style={{
            gap: "6px",
            borderRadius: "4px",
            padding: "4px",
            paddingBottom: "6px",
          }}
          onClick={() => setActiveItem(item.label)}
        >
          <item.icon size={14} />
          <p className="font-medium" style={{ fontSize: "14px" }}>
            {item.label}
          </p>
        </div>
      ))}
    </nav>
  );
};
