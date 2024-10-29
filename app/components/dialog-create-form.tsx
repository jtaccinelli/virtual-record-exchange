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
        <div className="border-b border-gray-950 p-6">
          <p className="heading">Create a Form</p>
        </div>
        <FormCreate />
      </Dialog>
    </>
  );
}
