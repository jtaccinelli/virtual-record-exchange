import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

import { votes } from "context/database";

import { ResultValue } from "@app/utils/results";

import { ResultsTooltip } from "@app/components/results-tooltip";
import { ResultsFooter } from "@app/components/results-footer";

type Props = {
  label: string;
  data: ResultValue[];
  canTiebreak?: boolean;
  field: string;
};

export function ResultsPie({ label, data, canTiebreak, field }: Props) {
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
      <ResultsFooter
        label={label}
        data={data}
        canTiebreak={canTiebreak}
        field={field}
      />
    </div>
  );
}
