import { useState } from "react";
import { Form, Link } from "@remix-run/react";

import { Dialog } from "./dialog";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

export function DialogCloseVoting({ playlist }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-primary-600 underline underline-offset-2"
      >
        Close Voting
      </button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="flex flex-col items-center px-8 py-12 text-center"
      >
        <span className="mb-6 text-6xl">🤔</span>
        <p className="mb-1 text-2xl font-bold">Are you sure?</p>
        <p className="mb-8 text-gray-500">
          Submission will no longer be accepted.
        </p>
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <Form action="/api/config/close" method="post">
            <input type="hidden" name="playlist-id" value={playlist.id} />
            <button className="btn btn-primary">Yes, close voting.</button>
          </Form>
          <button onClick={handleClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
}