import { LoaderIcon } from "lucide-react";

export const Loading = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ marginTop: "80px" }}
    >
      <LoaderIcon size={28} color="#ccc" className="animate-spin" />
    </div>
  );
};
