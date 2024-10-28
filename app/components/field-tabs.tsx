import { Field, Label, Textarea } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";

type Props<Value> = {
  name: string;
  label: string;
  defaultValue: Value;
  values: Value[];
};

export function FieldTabs<Value extends string | number>({
  name,
  label,
  values,
  defaultValue,
}: Props<Value>) {
  const [selectedValue, setSelectedValue] = useState<Value>(defaultValue);

  const handleSelectValue = (value: Value) => () => {
    setSelectedValue(value);
  };

  return (
    <Field className="flex flex-col">
      <Label className="mb-4 font-medium">{label}</Label>
      <input type="hidden" name={name} value={selectedValue} />
      <div className="flex gap-2 rounded bg-gray-950 p-2">
        {values.map((value) => (
          <button
            type="button"
            key={value}
            onClick={handleSelectValue(value)}
            className={clsx(
              "h-11 flex-grow rounded text-lg font-semibold transition-all",
              value === selectedValue
                ? "bg-primary-950 text-primary-500"
                : "border-transparent text-gray-500 hover:bg-gray-900 hover:text-white",
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </Field>
  );
}
