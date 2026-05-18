import { useState } from "react";
import { DeleteAllConfirmationModal } from "./delete-all-confirmation-modal";

export const DeleteAll = () => {
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-neutral-700 pt-5 pb-8">
        <p className="text-2xl font-medium">Delete All</p>
        <div className="bg-neutral-900 flex flex-col rounded border border-red-800">
          <p className="text-sm text-neutral-200 p-6">
            Permanently delete all data from LocalTube Manager. You will not be
            able to recover this data. <br /> Proceed with caution.
          </p>
          <div className="bg-red-900/10 border-t border-t-red-800 p-5">
            <button
              className="text-base font-medium bg-red-600 rounded cursor-pointer flex items-center gap-3 w-fit py-1.5 px-5"
              onClick={() => setIsDeleteAllModalOpen(true)}
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
      {isDeleteAllModalOpen && (
        <DeleteAllConfirmationModal
          setIsDeleteAllModalOpen={setIsDeleteAllModalOpen}
        />
      )}
    </>
  );
};
