import { DeleteAllConfirmationModal } from "./delete-all-confirmation-modal";

export const DeleteAll = ({ onRefresh }: { onRefresh: () => void }) => {
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col gap-4 border-b border-neutral-700"
        style={{
          padding: "20px 0 30px 0",
        }}
      >
        <h1 style={{ fontSize: "18px", fontWeight: "500" }}>Delete All</h1>
        <div className="bg-neutral-800 flex flex-col gap-5 rounded border border-red-800">
          <p
            className="text-neutral-200"
            style={{ padding: "20px 20px 15px 20px" }}
          >
            Permanently delete all data from LocalTube Manager. You will not be
            able to recover this data. <br /> Proceed with caution.
          </p>
          <div
            className="bg-red-900/10 border-t border-t-red-800"
            style={{ padding: "20px" }}
          >
            <button
              className="bg-red-600 rounded cursor-pointer flex items-center gap-3 w-fit "
              style={{
                padding: "5px 22px",
                fontSize: "16px",
                fontWeight: "500",
              }}
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
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
