import { ResultValue } from "@app/utils/results";
import { votes } from "context/database";
import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { ResultsTooltip } from "./results-tooltip";
import { DialogResults } from "./dialog-results";

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
      <div className="flex items-end justify-between px-3">
        <label className="label">{label}</label>
        <p className="text text-gray-400">
          {total} total {total > 1 ? "responses" : "response"}
        </p>
      </div>
      <div className="flex flex-col overflow-hidden rounded">
        {!winners.length ? (
          <p className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
            No data
          </p>
        ) : (
          winners.map((winner) => (
            <p className="flex justify-between border-b border-gray-900 bg-gray-800 p-3 text-left last:border-b-0">
              <span className="label text-white">{winner.name}</span>
              <span className="text text-gray-400">
                {winner.count} {winner.count > 1 ? "votes" : "vote"}
              </span>
            </p>
          ))
        )}
      </div>
      <DialogResults data={data} label={label} cta="See All Results" />
    </div>
  );
}
