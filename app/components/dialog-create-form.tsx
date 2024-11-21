import { useBoolean } from "@app/hooks/use-boolean";

import { Dialog } from "@app/components/dialog";
import { FormCreate } from "@app/components/form-create";

export function DialogCreateForm() {
  const [isOpen, setIsOpen] = useBoolean(false);

  return (
    <>
      <button onClick={setIsOpen.true} className="btn btn-primary">
        Create Form
      </button>
      <Dialog open={isOpen} onClose={setIsOpen.false} className="flex flex-col">
        <div className="border-b border-gray-950 p-6">
          <p className="heading">Create a Form</p>
        </div>
        <FormCreate />
      </Dialog>
    </>
  );
}
