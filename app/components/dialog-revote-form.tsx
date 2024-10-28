import { useRootLoaderData } from "@app/hooks/use-root-loader";

import { Dialog } from "./dialog";
import { Form, Link } from "@remix-run/react";
import { votes } from "context/database";

type Props = {
  vote?: typeof votes.$inferSelect;
  playlist: SpotifyApi.PlaylistObjectFull;
};

export function DialogRevoteForm({ vote, playlist }: Props) {
  if (!vote) return;

  return (
    <Dialog open={!!vote} className="flex flex-col items-center px-8 py-12">
      <span className="mb-6 text-6xl">🤔</span>
      <p className="mb-1 text-3xl font-bold">You've already voted!</p>
      <p className="mb-8 text-gray-500">
        You can always resubmit though. Click below to clear your previous vote.
      </p>
      <div className="flex gap-2">
        <Form action="/api/vote/delete" method="post">
          <input type="hidden" name="vote-id" value={vote.id} />
          <input type="hidden" name="playlist-id" value={playlist.id} />
          <button className="btn btn-primary">Revote</button>
        </Form>
        <Link to="/" className="btn btn-secondary">
          Nevermind
        </Link>
      </div>
    </Dialog>
  );
}
