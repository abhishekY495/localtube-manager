import { ImportForm } from "./import-form";

export const Import = () => {
  return (
    <div className="flex flex-col gap-4 border-b border-b-neutral-700 pt-5 pb-8">
      <p className="text-2xl font-medium">Import</p>
      <div className="bg-neutral-900 flex flex-col gap-5 rounded p-6">
        <div className="text-red-400 text-sm font-medium">
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
