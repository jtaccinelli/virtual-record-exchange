import { Link } from "@remix-run/react";
import { SpotifyImage } from "./spotify-image";

type Props = {
  user: User;
};

export function CardUser({ user }: Props) {
  return (
    <div className="group flex items-center overflow-hidden rounded bg-gray-800 transition-all hover:cursor-pointer hover:bg-gray-700 group-ui-[selected]:bg-white">
      <SpotifyImage image={user.images?.[0]} className="size-12 bg-gray-950" />
      <div className="flex min-w-0 grow flex-col px-3 py-2 text-left">
        <p className="label group-ui-[selected]:text-black">
          {user?.display_name ?? user.id}
        </p>
      </div>
      <Link
        to={user.external_urls.spotify}
        target="_blank"
        className="flex size-12 shrink-0 items-center justify-center"
      >
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
          className="size-4"
          alt="Spotify Logo"
        />
      </Link>
    </div>
  );
}
