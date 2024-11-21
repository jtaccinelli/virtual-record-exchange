import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ResultValue } from "@app/utils/results";

import { ResultsTooltip } from "@app/components/results-tooltip";
import { ResultsFooter } from "@app/components/results-footer";

type Props = {
  label: string;
  data: ResultValue[];
  canTiebreak?: boolean;
  field: string;
};

export function ResultsBar({ label, data, field, canTiebreak }: Props) {
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
      <ResultsFooter
        label={label}
        data={data}
        canTiebreak={canTiebreak}
        field={field}
      />
    </div>
  );
}
