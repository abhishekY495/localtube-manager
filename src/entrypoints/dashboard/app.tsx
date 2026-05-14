import { NAV_ITEM_LABELS, type NavItemLabel } from "../utils/constants";
import { Header } from "./components/header";
import { NavbarTabs } from "./components/navbar-tabs";

export default function App() {
  const [activeItem, setActiveItem] = useState<NavItemLabel>(
    NAV_ITEM_LABELS.SUBSCRIPTIONS,
  );

  return (
    <div className="mx-auto flex h-full max-w-[85%] flex-col">
      <Header />
      <NavbarTabs setActiveItem={setActiveItem} activeItem={activeItem} />
    </div>
  );
}
