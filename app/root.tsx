import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

import "./styles.css";

import { Favicon } from "@app/components/favicon";
import { Footer } from "@app/components/footer";
import { DialogSignIn } from "@app/components/dialog-sign-in";
import { DialogRefreshSession } from "@app/components/dialog-refresh-session";

export function meta() {
  return [
    { title: "Virtual Record Exchange" },
    { name: "description", content: "Tradin' tunes since '24" },
  ];
}

export function links() {
  return [{ rel: "stylesheet", href: "https://rsms.me/inter/inter.css" }];
}

export async function loader({ context }: LoaderFunctionArgs) {
  const isLoggedIn = !!context.auth.accessToken;
  const isTokenExpired = context.auth.expiresAt < Date.now();

  return {
    isLoggedIn,
    isTokenExpired,
    user: context.user,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Favicon emoji="💿" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-800 p-4 text-white ">
        <main className="mx-auto h-full w-full max-w-screen-sm overflow-y-scroll rounded-lg bg-gray-900">
          {children}
          <Footer />
        </main>
        <DialogSignIn />
        <DialogRefreshSession />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
