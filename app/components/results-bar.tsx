import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { ResultValue } from "@app/utils/results";

type Props = {
  label: string;
  data: ResultValue[];
};

export function ResultsBar({ label, data }: Props) {
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
          <ResponsiveContainer width="100%" aspect={5 / 2}>
            <BarChart data={data}>
              <Bar
                dataKey="count"
                className="overflow-hidden rounded-t fill-gray-500"
              />
              <XAxis dataKey="name" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
