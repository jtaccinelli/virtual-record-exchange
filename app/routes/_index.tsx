import { HeaderHome } from "@app/components/header-list";
import { HeaderVote } from "@app/components/header-vote";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <HeaderHome />
      <div className="sticky top-0 border-b-2 border-gray-800 px-6 py-4">
        <p className="text-lg font-medium">Open Voting Forms</p>
      </div>
      <div className="sticky top-0 border-b-2 border-gray-800 px-6 py-4">
        <p className="text-lg font-medium">Closed Voting Forms</p>
      </div>
    </div>
  );
}
