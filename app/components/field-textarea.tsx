type Props = {
  name: string;
  label: string;
};

export function FieldTextarea({ name, label }: Props) {
  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <label className="font-medium">{label}</label>
      <textarea
        name={name}
        className="rounded border-transparent bg-gray-700 text-white placeholder:text-gray-500"
      />
    </div>
  );
}
