import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./styles.css";

export function meta() {
  return [
    { title: "Remix Boilerplate" },
    { name: "description", content: "Get with Remix + Cloudflare." },
  ];
}

export function links() {
  return [{ rel: "stylesheet", href: "https://rsms.me/inter/inter.css" }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
