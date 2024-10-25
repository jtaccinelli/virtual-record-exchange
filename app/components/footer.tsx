import { useRootLoaderData } from "@app/hooks/use-root-loader";
import { SpotifyImage } from "./spotify-image";
import { Link } from "@remix-run/react";

export function Footer() {
  const { user } = useRootLoaderData();

  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t-2 border-gray-800 bg-gray-900 p-4 pr-6">
      <Link to="/" className="flex items-center gap-3">
        <SpotifyImage
          image={user?.images?.[0]}
          alt="Profile"
          className="size-10 rounded-full"
        />
        <div className="flex flex-col text-sm">
          <span className="text-gray-500">Signed in as</span>
          <span
            className="ext-gray-300 
          font-medium"
          >
            {user?.display_name}
          </span>
        </div>
      </Link>
      <Link
        to="/api/auth/sign-out"
        className="flex h-11 items-center text-sm text-primary-700 underline underline-offset-4"
      >
        Sign out
      </Link>
    </div>
  );
}
