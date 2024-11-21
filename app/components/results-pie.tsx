import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

import { votes } from "context/database";

import { ResultValue } from "@app/utils/results";

import { DialogResults } from "@app/components/dialog-results";
import { ResultsTooltip } from "@app/components/results-tooltip";
import { ResultsWinner } from "@app/components/results-winner";

type Vote = typeof votes.$inferSelect;

type Props = {
  label: string;
  data: ResultValue[];
};

export function ResultsPie({ label, data }: Props) {
  const total = useMemo(() => {
    return data.reduce((total, value) => total + value.count, 0);
  }, [data]);

  const winners = useMemo(() => {
    const top = data.reduce<ResultValue>(
      (final, value) => (value.count > final.count ? value : final),
      data[0],
    );

    return data.filter((value) => value.count === top.count);
  }, []);

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <div className="flex flex-col overflow-hidden rounded">
        {!data.length ? (
          <p className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
            No data
          </p>
        ) : (
          <ResponsiveContainer
            width="100%"
            aspect={16 / 9}
            className="bg-gray-800"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                className="overflow-hidden rounded-t fill-gray-400 stroke-gray-800 stroke-2"
                activeShape={<Sector className="fill-white stroke-gray-800" />}
              />
              <Tooltip cursor={false} content={<ResultsTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <ResultsWinner data={winners} label={label} total={total} />
      <DialogResults data={data} label={label} cta="See All Results" />
    </div>
  );
}
