import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "tailwindcss/types/config";

export function ResultsTooltip<Value extends ValueType, Name extends NameType>({
  active,
  payload,
  label,
}: TooltipProps<Value, Name>) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const { count, name } = payload[0].payload;

  return (
    <div className="flex flex-col rounded bg-gray-800 px-2 py-1">
      <p className="label">{name}</p>
      <p className="text text-gray-400">
        {count} {count > 1 ? "Votes" : "Vote"}
      </p>
    </div>
  );
}
