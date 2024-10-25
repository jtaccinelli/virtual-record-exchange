import { XMarkIcon } from "@heroicons/react/16/solid";

type Props = {
  onClick: () => void;
  label: string;
};

export function Pill({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded border-2 border-transparent bg-primary-950 px-3 py-1 text-sm font-medium text-primary-600"
    >
      <span>{label}</span>
      <XMarkIcon className="h-4 w-4" />
    </button>
  );
}
