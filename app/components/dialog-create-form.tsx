import { Dialog } from "./dialog";
import { useState } from "react";
import { FormCreate } from "./form-create";

export function DialogCreateForm() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button onClick={handleOpen} className="btn btn-primary">
        Create Form
      </button>
      <Dialog open={isOpen} onClose={handleClose} className="flex flex-col">
        <div className="border-b-2 border-gray-800 px-6 pb-8 pt-12">
          <p className="mb-1 text-2xl font-bold">Create a Form</p>
          <p className="text-gray-500">Create a voting form using the below</p>
        </div>
        <FormCreate />
      </Dialog>
    </>
  );
}
