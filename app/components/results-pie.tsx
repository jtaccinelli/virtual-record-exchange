import { ResultValue } from "@app/utils/results";
import { votes } from "context/database";
import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { ResultsTooltip } from "./results-tooltip";

type Vote = typeof votes.$inferSelect;

type Props = {
  label: string;
  data: ResultValue[];
};

export function ResultsPie({ label, data }: Props) {
  const total = useMemo(() => {
    return data.reduce((total, value) => total + value.count, 0);
  }, [data]);

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <div className="flex items-end justify-between">
        <label className="label">{label}</label>
        <p className="text text-gray-400">{total} answer(s)</p>
      </div>

      <div className="flex flex-col overflow-hidden rounded">
        {!data.length ? (
          <p className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
            No data
          </p>
        ) : (
          <ResponsiveContainer width="100%" aspect={1}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                className="overflow-hidden rounded-t fill-gray-400 stroke-gray-800"
                activeShape={<Sector className="fill-white stroke-gray-800" />}
              />
              <Tooltip cursor={false} content={<ResultsTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
