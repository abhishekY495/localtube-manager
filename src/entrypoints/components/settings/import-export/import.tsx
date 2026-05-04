import { ImportForm } from "./import-form";

export const Import = () => {
  return (
    <div
      className="flex flex-col gap-4 border-b border-b-neutral-700"
      style={{ paddingBottom: "30px", marginBottom: "20px" }}
    >
      <p style={{ fontSize: "18px", fontWeight: "500" }}>Import</p>
      <div
        className="bg-neutral-800 flex flex-col gap-5 rounded"
        style={{ padding: "20px 30px 35px" }}
      >
        <div
          className="text-red-400"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          <p>* Importing from LocalTube will remove existing data.</p>
          <p>
            * Importing Google Takeout (subscriptions.csv) will import your
            subscribed channels and will not remove any existing data.
          </p>
        </div>
        <ImportForm />
      </div>
    </div>
  );
};
