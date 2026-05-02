export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  className,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  className?: string;
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 border-b-2 border-neutral-700 ${className}`}
      style={{
        padding: "6px 8px",
        fontSize: "14px",
      }}
    >
      <input
        type="text"
        placeholder="Type to search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="w-full rounded bg-transparent outline-none ring-0 focus:border-neutral-700 focus:outline-none focus:ring-0 focus-visible:outline-none"
        style={{
          padding: "5px",
        }}
      />
    </div>
  );
};
