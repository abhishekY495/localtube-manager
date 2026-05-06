import logo from "@/assets/logo.png";

export const SidebarHeader = () => {
  return (
    <header
      className="border-b border-neutral-700 bg-neutral-800 flex items-center gap-3 justify-center"
      style={{
        paddingBlock: "8px",
      }}
    >
      <img
        src={logo}
        alt="LocalTube Manager"
        className="rounded"
        width={16}
        height={16}
      />
      <p style={{ fontSize: "18px", fontWeight: 500 }}>LocalTube Manager</p>
    </header>
  );
};
