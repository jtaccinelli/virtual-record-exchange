import { Form } from "@remix-run/react";

import { DialogConfirm } from "./dialog-confirm";

type Props = {
  playlist: Playlist;
  className: string;
};

export function DialogCloseVoting({ playlist, className }: Props) {
  return (
    <DialogConfirm
      label="Close Voting"
      emoji="🤔"
      heading="Are you sure?"
      subheading="Submissions will be stopped."
      className={className}
    >
      <Form action="/api/config/close" method="post">
        <input type="hidden" name="playlist-id" value={playlist.id} />
        <button className="btn btn-primary">Yes, close voting</button>
      </Form>
    </DialogConfirm>
  );
}
