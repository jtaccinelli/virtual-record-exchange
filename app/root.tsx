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
  return [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
    },
  ];
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

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Favicon emoji="💿" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-800 text-white md:p-4 ">
        <main className="mx-auto h-full w-full max-w-screen-sm overflow-y-scroll bg-gray-900 md:rounded-lg">
          <div className="min-h-full">
            <Outlet />
          </div>
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
