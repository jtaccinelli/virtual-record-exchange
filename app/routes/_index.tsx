import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  return { accessToken: context.auth.accessToken };
}

export default function Index() {
  const { accessToken } = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Hello!</p>
      {!accessToken ? (
        <Link to="/api/auth/sign-in">Sign In</Link>
      ) : (
        <Link to="/api/auth/sign-out">Sign Out</Link>
      )}
    </div>
  );
}
