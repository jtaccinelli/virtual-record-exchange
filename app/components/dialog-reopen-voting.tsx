import { Form } from "@remix-run/react";

import { DialogConfirm } from "./dialog-confirm";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

export function DialogReopenVoting({ playlist }: Props) {
  return (
    <DialogConfirm
      label="Reopen Voting"
      emoji="🤔"
      heading="Are you sure?"
      subheading="Submissions will be re-enabled."
      className="link text-primary-600"
    >
      <Form action="/api/config/open" method="post">
        <input type="hidden" name="playlist-id" value={playlist.id} />
        <button className="btn btn-primary">Yes, reopen voting</button>
      </Form>
    </DialogConfirm>
  );
}
