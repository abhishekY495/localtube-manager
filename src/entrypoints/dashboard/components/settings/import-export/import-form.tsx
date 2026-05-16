import { useState } from "react";
import type { ImportType } from "@/entrypoints/utils/types";
import toast from "react-hot-toast";
import { UploadIcon } from "lucide-react";
import googleIcon from "@/assets/google-icon.svg";
import { importSubscribedChannelsFromTakeout } from "@/entrypoints/content/functions/import/import-subscribed-channels-from-takeout";
import { importDatabaseFromJson } from "@/entrypoints/indexed-db/settings";

export const ImportForm = () => {
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
      try {
        await importDatabaseFromJson(json);
        toast.success(
          "Database imported successfully, \n Reloading in 3 seconds...",
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        toast.error("Something went wrong,\n Refresh and try again");
        return;
      }
    }

    if (importType === "google") {
      try {
        const csvContent = await selectedFile.text();
        await toast.promise(importSubscribedChannelsFromTakeout(csvContent), {
          loading: "Adding channels",
          success: "Channels added successfully, \n Reloading in 3 seconds...",
          error: "Something went wrong,\n Refresh and try again",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        toast.error("Something went wrong,\n Refresh and try again");
        return;
      }
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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex items-center bg-neutral-700 w-full rounded text-sm">
        <p className="bg-neutral-700 font-medium px-4">Select a file</p>
        <p className="flex-1 bg-neutral-800 border-2 border-neutral-700 text-neutral-300 py-2 px-4">
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
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="text-base font-medium bg-neutral-200 text-neutral-900 rounded py-1.5 px-5 cursor-pointer flex items-center gap-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile || importType === "google"}
        >
          <UploadIcon size={16} />
          Import
        </button>
        <button
          type="submit"
          className="text-base font-medium bg-neutral-200 text-neutral-900 rounded py-1.5 px-5 cursor-pointer flex items-center gap-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile || importType === "local"}
        >
          <img src={googleIcon} alt="Google" width={18} height={18} />
          Takeout
        </button>
      </div>
    </form>
  );
};
