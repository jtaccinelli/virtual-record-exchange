import clsx from "clsx";

type Props = {
  label: string;
  loading?: boolean;
};

export function Placeholder({ label, loading }: Props) {
  return (
    <p className="text flex items-center justify-between rounded border border-gray-600 p-4 text-gray-600">
      <span>{label}</span>
      <span
        className={clsx(
          "flex size-4 origin-center animate-spin items-center justify-center rounded-full border-2 border-white border-r-transparent",
          !loading && "hidden",
        )}
      />
    </p>
  );
}
