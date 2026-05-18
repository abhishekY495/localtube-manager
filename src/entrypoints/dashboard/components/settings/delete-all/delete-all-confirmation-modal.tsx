import { deleteAll } from "@/entrypoints/indexed-db/settings";
import toast from "react-hot-toast";

export const DeleteAllConfirmationModal = ({
  setIsDeleteAllModalOpen,
}: {
  setIsDeleteAllModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const closeModal = () => {
    setIsDeleteAllModalOpen(false);
  };

  const deleteAllButtonHandler = async () => {
    try {
      await deleteAll();
      closeModal();
      toast.success(
        "All data has been deleted successfully, \n Reloading in 3 seconds...",
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-[360px] mt-[-420px] border-2 border-neutral-800 bg-neutral-900 rounded">
        <div className="flex flex-col gap-2 p-4">
          <h2 className="text-lg font-medium">Are you sure?</h2>
          <p className="text-sm text-neutral-400">
            This action cannot be undone. This will permanently delete all data
            from LocalTube Manager. You will not be able to recover this data.
          </p>
        </div>

        <div className="flex justify-end gap-3 bg-neutral-800 p-4">
          <button
            className="bg-neutral-700 rounded cursor-pointer border border-neutral-600 text-sm font-semibold p-1 px-3"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 rounded cursor-pointer text-sm font-semibold p-1 px-3"
            onClick={deleteAllButtonHandler}
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};
