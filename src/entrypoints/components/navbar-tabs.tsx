import { ACTIONS, NAV_ITEMS } from "../utils/constants";
import type { NavItemLabel } from "../utils/constants";
import { formatNumber } from "../utils/format-number";
import { getNavItemCount } from "../utils/get-nav-item-count";
import type { CountResponse, Message, Response } from "../utils/types";

export const NavbarTabs = ({
  setActiveItem,
  activeItem,
  onRefresh,
}: {
  setActiveItem: (item: NavItemLabel) => void;
  activeItem: NavItemLabel;
  onRefresh: () => void;
}) => {
  const [count, setCount] = useState<CountResponse | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const response: Response<CountResponse> =
        await browser.runtime.sendMessage({
          action: ACTIONS.GET_COUNT,
        } satisfies Message);
      if (!response.success) {
        return;
      }
      setCount(response.data);
    };
    fetchCount();
  }, [onRefresh]);

  return (
    <nav className="flex items-center justify-around border-b border-neutral-700">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col gap-2 items-center justify-center cursor-pointer border border-neutral-700 w-full ${
            activeItem === item.label
              ? "bg-neutral-300 text-black"
              : "hover:bg-neutral-800"
          }`}
          style={{
            padding: "10px 10px 8px 10px",
          }}
          onClick={() => setActiveItem(item.label)}
        >
          <item.icon />
          <p className="font-medium" style={{ fontSize: "14px" }}>
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
