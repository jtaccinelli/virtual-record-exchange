import { useEffect, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";

import { ResultValue, TIEBREAK_VOTER } from "@app/utils/results";

import { useBoolean } from "@app/hooks/use-boolean";
import { usePlaylist } from "@app/hooks/use-playlist";

import { Dialog } from "@app/components/dialog";

type Props = {
  cta: string;
  field: string;
  disabled?: boolean;
  items: ResultValue[];
  className?: string;
};

export function DialogTiebreak({
  cta,
  disabled,
  items,
  className,
  field,
}: Props) {
  const [isOpen, setIsOpen] = useBoolean(false);
  const [selectedId, setSelectedId] = useState("");
  const playlist = usePlaylist();

  const navigation = useNavigation();

  useEffect(() => {
    if (disabled) setIsOpen.false();
  }, [disabled]);

  useEffect(() => {
    if (navigation.state !== "idle") setIsOpen.false();
  }, [navigation]);

  const handleSetId = (item: ResultValue) => () => {
    setSelectedId(item.id);
  };

  console.log(playlist);

  return (
    <>
      <button
        type="button"
        onClick={setIsOpen.true}
        className={className}
        disabled={disabled}
      >
        {cta}
      </button>
      <Dialog open={isOpen} onClose={setIsOpen.false} className="flex flex-col">
        <div className="border-b border-gray-950 p-6">
          <p className="heading">Tiebreak</p>
        </div>
        <div className="flex h-full flex-col gap-3 p-6 text-white">
          <p className="label text-gray-300">Which one of these won?</p>
          <div className="flex flex-col overflow-hidden rounded">
            {!items.length ? (
              <div className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
                No Results Found
              </div>
            ) : (
              items.map((item) => (
                <button
                  onClick={handleSetId(item)}
                  data-ui={item.id === selectedId && "selected"}
                  className="flex justify-between border-b border-gray-900 bg-gray-800 p-3 text-left last:border-b-0 ui-[selected]:bg-white ui-[selected]:text-black"
                >
                  {item.name}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="sticky bottom-0 border-t border-gray-950 bg-gray-900 px-6 py-4">
          <Form action="/api/vote/create" method="post">
            <input type="hidden" name="voter-id" value={TIEBREAK_VOTER} />
            <input type="hidden" name="playlist-id" value={playlist.id} />
            <input type="hidden" name={field} value={selectedId} />
            <button
              type="submit"
              className="btn btn-primary self-start"
              disabled={!selectedId}
            >
              Submit Tiebreaker
            </button>
          </Form>
        </div>
      </Dialog>
    </>
  );
}
