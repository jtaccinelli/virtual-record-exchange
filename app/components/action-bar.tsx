import { ReactNode } from "react";

type Props = {
  message: string;
  actions: ReactNode[];
};

export function ActionBar({ message, actions }: Props) {
  return (
    <div className="flex flex-col justify-between gap-2 bg-gray-300 p-6 text-gray-950 md:flex-row md:px-6 md:py-4">
      <p className="label">{message}</p>
      <div className="flex gap-4">{actions}</div>
    </div>
  );
}
