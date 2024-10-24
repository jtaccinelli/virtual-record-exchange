import { useRootLoaderData } from "@app/hooks/use-root-loader";
import { SpotifyImage } from "./spotify-image";
import { Link } from "@remix-run/react";

export function Header() {
  const { user } = useRootLoaderData();

  return (
    <div className="sticky top-0 p-3">
      <div className="flex h-14 items-center justify-between gap-4 rounded border-t border-gray-800 bg-gray-900/80 pl-3 pr-6 backdrop-blur">
        {!user ? (
          <div className="size-10 rounded-full bg-gray-800" />
        ) : (
          <div className="flex items-center gap-3">
            <SpotifyImage
              image={user?.images?.[0]}
              alt="Profile"
              className="size-10 rounded-full"
            />
            <p className="text-sm font-medium text-gray-300">
              {user.display_name}
            </p>
          </div>
        )}
        <Link
          to="/api/auth/sign-out"
          className="flex h-11 items-center text-sm text-primary-700 underline underline-offset-4"
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}
