import { Form } from "@remix-run/react";

import { DialogConfirm } from "./dialog-confirm";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

export function DialogDeleteForm({ playlist }: Props) {
  return (
    <DialogConfirm
      label="Delete Form"
      emoji="🤔"
      heading="Are you sure?"
      subheading="This can't be undone!"
      className="link text-primary-600"
    >
      <Form action="/api/config/delete" method="post">
        <input type="hidden" name="playlist-id" value={playlist.id} />
        <button className="btn btn-primary">Yes, delete this</button>
      </Form>
    </DialogConfirm>
  );
}
