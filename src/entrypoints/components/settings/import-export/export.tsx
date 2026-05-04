import { ACTIONS, EXPORT_FILE_NAME } from "@/entrypoints/utils/constants";
import { formatFileSize } from "@/entrypoints/utils/format-file-size";
import { useEffect, useState } from "react";
import type {
  ExportDatabaseToJsonResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import { DownloadIcon } from "lucide-react";
import toast from "react-hot-toast";

export const Export = () => {
  const [databaseJson, setDatabaseJson] = useState<string | null>(null);
  const [jsonSize, setJsonSize] = useState<number>(0);

  const exportButtonHandler = async () => {
    if (databaseJson) {
      const blob = new Blob([databaseJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = EXPORT_FILE_NAME;
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
      toast.success("Database exported successfully");
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  };

  useEffect(() => {
    const fetchDatabase = async () => {
      const response: Response<ExportDatabaseToJsonResponse> =
        await browser.runtime.sendMessage({
          action: ACTIONS.EXPORT_DATABASE_TO_JSON,
        } satisfies Message);
      if (!response.success) {
        console.error("Failed to export database to json:", response.error);
        return;
      }
      const json = response.data.json;
      setDatabaseJson(json);
      const blob = new Blob([json], { type: "application/json" });
      setJsonSize(blob.size);
    };
    fetchDatabase();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p style={{ fontSize: "18px", fontWeight: "500" }}>Export</p>
      <div
        className="bg-neutral-800 flex flex-col gap-5 rounded"
        style={{ padding: "20px 30px 35px" }}
      >
        <p
          className="text-neutral-300 underline underline-offset-4 decoration-neutral-500"
          style={{ fontSize: "16px", fontWeight: "500" }}
        >
          {EXPORT_FILE_NAME} - {formatFileSize(jsonSize)}
        </p>
        <button
          className="bg-neutral-200 text-neutral-900 rounded cursor-pointer flex items-center gap-3 w-fit"
          style={{
            padding: "5px 22px",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={exportButtonHandler}
        >
          <DownloadIcon size={16} />
          Export
        </button>
      </div>
    </div>
  );
};
