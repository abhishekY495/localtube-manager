import { UploadIcon } from "lucide-react";
import { useState } from "react";
import googleIcon from "@/assets/google-icon.svg";
import toast from "react-hot-toast";
import type { ImportType, Message, Response } from "@/entrypoints/utils/types";
import { ACTIONS } from "@/entrypoints/utils/constants";
import { importSubscribedChannelsFromTakeout } from "@/entrypoints/content/functions/import/import-subscribed-channels-from-takeout";

export const ImportForm = ({ onRefresh }: { onRefresh: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>("local");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a valid file");
      return;
    }

    if (importType === "local") {
      const json = await selectedFile.text();
      const response: Response = await browser.runtime.sendMessage({
        action: ACTIONS.IMPORT_DATABASE_FROM_JSON,
        data: { json },
      } satisfies Message);
      if (!response.success) {
        toast.error("Something went wrong,\n Refresh and try again");
        return;
      }
      toast.success("Database imported successfully");
      onRefresh();
    }

    if (importType === "google") {
      const csvContent = await selectedFile.text();
      toast.promise(importSubscribedChannelsFromTakeout(csvContent), {
        loading: "Adding channels",
        success: "Channels added successfully",
        error: "Something went wrong,\n Refresh and try again",
      });
      onRefresh();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".")?.pop()?.toLowerCase();
      if (fileExtension !== "json" && fileExtension !== "csv") {
        toast.error("Please select a valid file");
        return;
      }
      if (fileExtension === "json") {
        setImportType("local");
      }
      if (fileExtension === "csv") {
        setImportType("google");
      }
      setSelectedFile(file);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 justify-center w-full"
    >
      <label
        className="flex items-center bg-neutral-700 w-full rounded"
        style={{
          fontSize: "14px",
        }}
      >
        <p
          className="bg-neutral-700"
          style={{
            fontWeight: "500",
            padding: "0px 18px",
          }}
        >
          Select a file
        </p>
        <p
          className="flex-1 bg-neutral-800 border-2 border-neutral-700 text-neutral-300"
          style={{ padding: "6px 10px" }}
        >
          {selectedFile ? selectedFile.name : "No file chosen"}
        </p>
        {/*  */}
        <input
          onChange={handleFileChange}
          type="file"
          accept=".json, .csv"
          className="opacity-0 absolute"
          required
        />
      </label>
      <div className="flex items-center gap-6">
        <button
          type="submit"
          className="bg-neutral-200 text-neutral-900 rounded cursor-pointer flex items-center gap-3 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile || importType === "google"}
          style={{
            padding: "5px 22px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          <UploadIcon size={16} />
          Import
        </button>
        <button
          type="submit"
          className="bg-neutral-200 text-neutral-900 rounded cursor-pointer flex items-center gap-3 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile || importType === "local"}
          style={{
            padding: "5px 22px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          <img src={googleIcon} alt="Google" width={18} height={18} />
          Takeout
        </button>
      </div>
    </form>
  );
};
