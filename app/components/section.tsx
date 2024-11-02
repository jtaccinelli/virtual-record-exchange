import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function Section({ title, children }: Props) {
  return (
    <div className="flex flex-col pb-10">
      <p className="label sticky top-0 border-t border-gray-800 bg-gray-900 p-6">
        {title}
      </p>
      <div className="flex flex-col gap-4 px-6 pt-2">{children}</div>
    </div>
  );
}
