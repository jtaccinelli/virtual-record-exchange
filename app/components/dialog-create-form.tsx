import { Dialog } from "./dialog";
import { FormCreate } from "./form-create";
import { useBoolean } from "@app/hooks/use-boolean";

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
