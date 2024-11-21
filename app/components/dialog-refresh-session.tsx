import { Link } from "@remix-run/react";

import { useRootLoaderData } from "@app/hooks/use-root-loader";

import { DialogBasic } from "@app/components/dialog-basic";

export function DialogRefreshSession() {
  const { isLoggedIn, isTokenExpired } = useRootLoaderData();

  return (
    <DialogBasic
      open={isLoggedIn && isTokenExpired}
      emoji="❤️‍🩹"
      heading="Oh no!"
      subheading="Looks like your session has expired"
    >
      <Link to="/api/auth/refresh" className="btn btn-primary">
        Refresh Session
      </Link>
      <Link to="/api/auth/sign-out" className="btn btn-secondary">
        Sign Out
      </Link>
    </DialogBasic>
  );
}
