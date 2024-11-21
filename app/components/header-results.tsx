import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

type Props = {
  playlist: Playlist;
};

export function HeaderResults({ playlist }: Props) {
  return (
    <div className="flex w-full flex-col gap-6 p-6 pt-10">
      <Link to="/" className="flex items-center gap-2">
        <ArrowLeftIcon className="size-4" />
        <span className="link">Back to home page</span>
      </Link>
      <p className="text -mb-6 text-gray-400">Playlist Results</p>
      <h3 className="heading">{playlist.name}</h3>
    </div>
  );
}
