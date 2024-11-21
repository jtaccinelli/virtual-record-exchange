import { DialogCreateForm } from "@app/components/dialog-create-form";

export function HeaderHome() {
  return (
    <div className="flex w-full flex-col border-gray-800 p-6 pt-20">
      <div className="flex items-center justify-between">
        <h3 className="heading">Voting Forms</h3>
        <DialogCreateForm />
      </div>
    </div>
  );
}
