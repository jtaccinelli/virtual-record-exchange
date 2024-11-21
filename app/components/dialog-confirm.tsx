import { ReactNode } from "react";

import { useBoolean } from "@app/hooks/use-boolean";
import { DialogBasic } from "@app/components/dialog-basic";

type Props = {
  label: string;
  emoji: string;
  heading: string;
  subheading: string;
  children?: ReactNode;
  className?: string;
};

export function DialogConfirm({
  label,
  emoji,
  heading,
  subheading,
  className,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useBoolean(false);

  return (
    <>
      <button onClick={setIsOpen.true} className={className} tabIndex={0}>
        {label}
      </button>
      <DialogBasic
        open={isOpen}
        emoji={emoji}
        heading={heading}
        subheading={subheading}
      >
        {children}
        <button onClick={setIsOpen.false} className="btn btn-secondary">
          Cancel
        </button>
      </DialogBasic>
    </>
  );
}
