type Props = {
  name: string;
  label: string;
  placeholder: string;
};

export function FieldTextarea({ name, label, placeholder }: Props) {
  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <label className="label">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        className="rounded border-transparent bg-gray-700 p-3 text-white placeholder:text-gray-500"
        rows={3}
      />
    </div>
  );
}
