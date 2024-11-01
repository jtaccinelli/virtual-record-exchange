import { useMemo, useState } from "react";

import { Dialog } from "./dialog";
import { ResultValue } from "@app/utils/results";

type Props = {
  label: string;
  cta: string;
  data: ResultValue[];
};

export function DialogResults({ label, cta, data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      if (a.count == b.count) return 0;
      if (a.count > b.count) return 1;
      return -1;
    });
  }, [data]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn btn-primary self-start"
      >
        {cta}
      </button>
      <Dialog open={isOpen} onClose={handleClose} className="flex flex-col">
        <div className="flex h-full flex-col gap-3 p-6">
          <label className="label">{label}</label>
          {!sortedData.length ? (
            <div className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
              No Results Found
            </div>
          ) : (
            <div className="flex flex-col overflow-hidden rounded">
              {sortedData.map((item) => (
                <p className="flex justify-between border-b border-gray-900 bg-gray-800 p-3 text-left last:border-b-0">
                  <span className="label text-white">{item.name}</span>
                  <span className="text text-gray-400">
                    {item.count} {item.count > 1 ? "votes" : "vote"}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
