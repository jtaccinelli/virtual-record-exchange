import { Link } from "@remix-run/react";

import { useRootLoaderData } from "@app/hooks/use-root-loader";

import { DialogBasic } from "@app/components/dialog-basic";

export function DialogSignIn() {
  const { isLoggedIn } = useRootLoaderData();

  return (
    <DialogBasic
      open={!isLoggedIn}
      emoji="💿"
      heading="Welcome to the VRE!"
      subheading="Trading tunes since '24"
    >
      <Link to="/api/auth/sign-in" className="btn btn-primary">
        Sign in w/ Spotify
      </Link>
    </DialogBasic>
  );
}
