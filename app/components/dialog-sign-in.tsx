import { useRootLoaderData } from "@app/hooks/use-root-loader";

import { Dialog } from "./dialog";
import { Link } from "@remix-run/react";

export function DialogSignIn() {
  const { isLoggedIn } = useRootLoaderData();

  return (
    <Dialog
      open={!isLoggedIn}
      className="flex flex-col items-center px-8 py-12"
    >
      <span className="mb-6 text-6xl">💿</span>
      <p className="mb-1 text-3xl font-bold">Welcome to the VRE!</p>
      <p className="mb-8 text-gray-500">Trading tunes since '24</p>
      <Link to="/api/auth/sign-in" className="btn btn-primary">
        Sign in w/ Spotify
      </Link>
    </Dialog>
  );
}
