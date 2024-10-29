import { DialogCreateForm } from "./dialog-create-form";

export function HeaderHome() {
  return (
    <div className="flex flex-col border-b-2 border-gray-800 p-4 pt-20">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Voting Forms</h3>
        <DialogCreateForm />
      </div>
    </div>
  );
}
