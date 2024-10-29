import { useRootLoaderData } from "@app/hooks/use-root-loader";

import { Dialog } from "./dialog";
import { Link } from "@remix-run/react";

export function DialogCantVote() {
  return (
    <Dialog
      open={true}
      className="flex flex-col items-center px-8 py-12 text-center"
    >
      <span className="mb-6 text-6xl">🧑‍⚖️</span>
      <p className="mb-1 text-2xl font-bold">You can't vote!</p>
      <p className="mb-8 text-gray-500">
        You didn't contribute to this playlist.
      </p>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </Dialog>
  );
}
