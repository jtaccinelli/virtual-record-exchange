import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ResultValue } from "@app/utils/results";

import { DialogResults } from "@app/components/dialog-results";
import { ResultsTooltip } from "@app/components/results-tooltip";
import { ResultsWinner } from "@app/components/results-winner";

type Props = {
  label: string;
  data: ResultValue[];
};

export function ResultsBar({ label, data }: Props) {
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
        {!data.length ? null : (
          <ResponsiveContainer
            width="100%"
            aspect={16 / 9}
            className="bg-gray-800"
          >
            <BarChart data={data} className="-mb-1 px-8 pt-8">
              <Bar
                dataKey="count"
                shape={
                  <Rectangle className="fill-gray-500" radius={[4, 4, 0, 0]} />
                }
                activeBar={
                  <Rectangle className="fill-white" radius={[4, 4, 0, 0]} />
                }
              />
              <Tooltip cursor={false} content={<ResultsTooltip />} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <ResultsWinner data={winners} label={label} total={total} />
      <DialogResults data={data} label={label} cta="See All Results" />
    </div>
  );
}
