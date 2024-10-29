import { useRootLoaderData } from "@app/hooks/use-root-loader";

import { Dialog } from "./dialog";
import { Link } from "@remix-run/react";

export function DialogRefreshSession() {
  const { isLoggedIn, isTokenExpired } = useRootLoaderData();

  return (
    <Dialog
      open={isLoggedIn && isTokenExpired}
      className="flex flex-col items-center px-8 py-12"
    >
      <span className="mb-6 text-6xl">❤️‍🩹</span>
      <p className="mb-1 text-2xl font-bold">Oh no!</p>
      <p className="mb-8 text-gray-500">Looks like your session has expired</p>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <Link to="/api/auth/refresh" className="btn btn-primary">
          Refresh Session
        </Link>
        <Link to="/api/auth/sign-out" className="btn btn-secondary">
          Sign Out
        </Link>
      </div>
    </Dialog>
  );
}
