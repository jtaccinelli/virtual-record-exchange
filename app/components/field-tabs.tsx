import { useState } from "react";
import clsx from "clsx";

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
    <div className="flex flex-col gap-4 p-8 px-6">
      <input type="hidden" name={name} value={selectedValue} />
      <label className="label">{label}</label>
      <div className="flex gap-2 rounded bg-gray-700 p-1">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={handleSelectValue(value)}
            className={clsx(
              "label h-11 grow rounded transition-all",
              value === selectedValue
                ? "bg-gray-900 text-white"
                : "border-transparent text-gray-500 hover:bg-gray-800",
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
