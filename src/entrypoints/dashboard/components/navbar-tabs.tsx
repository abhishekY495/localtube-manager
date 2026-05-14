import { useState } from "react";
import { NAV_ITEMS, type NavItemLabel } from "@/entrypoints/utils/constants";
import { formatNumber } from "@/entrypoints/utils/format-number";
import { getNavItemCount } from "@/entrypoints/utils/get-nav-item-count";
import type { CountResponse } from "@/entrypoints/utils/types";
import { getCount } from "@/entrypoints/indexed-db/get-count";

export const NavbarTabs = ({
  setActiveItem,
  activeItem,
}: {
  setActiveItem: (item: NavItemLabel) => void;
  activeItem: NavItemLabel;
}) => {
  const [count, setCount] = useState<CountResponse | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getCount();
        setCount(count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCount();
  }, []);

  return (
    <nav className="flex items-center justify-around">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col gap-1.5 items-center p-3 justify-center cursor-pointer border border-t-0 border-neutral-700/70 first:border-l-0 last:border-r-0 w-full ${
            activeItem === item.label
              ? "bg-neutral-200 text-black"
              : "hover:bg-neutral-800"
          }`}
          onClick={() => setActiveItem(item.label)}
        >
          <item.icon size={28} />
          <p className="text-lg font-semibold">
            {item.showCount && (
              <span>
                {formatNumber(Number(getNavItemCount(item.label, count)))}
              </span>
            )}{" "}
            {item.label}
          </p>
        </div>
      ))}
    </nav>
  );
};
