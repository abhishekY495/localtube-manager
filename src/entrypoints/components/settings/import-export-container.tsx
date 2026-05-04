import { useEffect } from "react";
import { ACTIONS, EXPORT_FILE_NAME } from "@/entrypoints/utils/constants";
import type {
  ExportDatabaseToJsonResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import { formatFileSize } from "@/entrypoints/utils/format-file-size";
import { DownloadIcon } from "lucide-react";
import toast from "react-hot-toast";

export const ImportExportContainer = () => {
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
      <p style={{ fontSize: "18px", fontWeight: "500" }}>Import/Export</p>
      <div
        className="grid grid-cols-2 bg-neutral-800 rounded"
        style={{ padding: "15px 24px" }}
      >
        <div
          className="w-full flex flex-col gap-4 items-center justify-center border-r border-r-neutral-600"
          style={{
            paddingBlock: "26px",
          }}
        >
          import
        </div>
        <div
          className="w-full flex flex-col gap-4 items-center justify-center border-l border-l-neutral-600"
          style={{
            paddingBlock: "26px",
          }}
        >
          <p
            className="text-neutral-300 underline underline-offset-4 decoration-neutral-500"
            style={{ fontSize: "16px", fontWeight: "500" }}
          >
            {EXPORT_FILE_NAME} - {formatFileSize(jsonSize)}
          </p>
          <button
            className="bg-neutral-200 text-neutral-900 rounded cursor-pointer flex items-center gap-3"
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
    </div>
  );
};
