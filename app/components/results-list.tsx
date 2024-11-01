import { votes } from "context/database";
import { useMemo } from "react";

type Vote = typeof votes.$inferSelect;

type Props = {
  label: string;
  votes: Vote[];
  map: (vote: Vote) => string | null;
};

export function ResultsList({ label, votes, map }: Props) {
  const items = useMemo(() => {
    return votes.map(map).filter((item) => !!item);
  }, [votes]);

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <div className="flex items-end justify-between">
        <label className="label">{label}</label>
        <p className="text text-gray-400">{items.length} answer(s)</p>
      </div>

      <div className="flex flex-col overflow-hidden rounded">
        {!items.length ? (
          <p className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
            No submissions
          </p>
        ) : (
          items.map((item) => (
            <p className="border-b border-gray-900 bg-gray-800 p-3 text-left last:border-b-0">
              {item}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
