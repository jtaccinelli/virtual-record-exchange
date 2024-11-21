import { useMemo } from "react";

import { ResultValue } from "@app/utils/results";

import { DialogResults } from "@app/components/dialog-results";
import { DialogTiebreak } from "@app/components/dialog-tiebreak";

type Props = {
  data: ResultValue[];
  label: string;
  field: string;
  canTiebreak?: boolean;
};

export function ResultsFooter({ data, label, field, canTiebreak }: Props) {
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
    <>
      <div className="flex items-end justify-between pt-2">
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
          winners.map((item) => (
            <p className="flex justify-between border-b border-gray-900 bg-gray-800 p-3 text-left last:border-b-0">
              <span className="label grow truncate text-white">
                {item.name}
              </span>
              <span className="text whitespace-nowrap text-gray-400">
                {item.count} {item.count > 1 ? "votes" : "vote"}
              </span>
            </p>
          ))
        )}
      </div>
      <div className="flex gap-3">
        <DialogResults data={data} label={label} cta="See All Results" />
        {!canTiebreak || winners.length <= 1 ? null : (
          <DialogTiebreak
            cta="Tiebreak"
            field={field}
            className="btn btn-secondary"
            items={winners}
          />
        )}
      </div>
    </>
  );
}
