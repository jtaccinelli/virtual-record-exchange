import { ResultValue } from "@app/utils/results";

type Props = {
  data: ResultValue[];
  label: string;
  total: number;
};

export function ResultsWinner({ data, label, total }: Props) {
  return (
    <>
      <div className="flex items-end justify-between pt-2">
        <label className="label">{label}</label>
        <p className="text text-gray-400">
          {total} total {total > 1 ? "responses" : "response"}
        </p>
      </div>
      <div className="flex flex-col overflow-hidden rounded">
        {!data.length ? (
          <p className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
            No data
          </p>
        ) : (
          data.map((item) => (
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
    </>
  );
}
