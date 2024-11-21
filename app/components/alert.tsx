import { Link } from "@remix-run/react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

type Props = {
  message: string;
  cta: string;
  href: string;
};

export function Alert({ message, cta, href }: Props) {
  return (
    <div className="flex  gap-3 rounded bg-white p-3 text-black md:items-center">
      <InformationCircleIcon className="h-5 w-5" />
      <div className="flex grow flex-col gap-1 md:flex-row">
        <p className="text grow">{message}</p>
        <Link to={href} className="link">
          {cta}
        </Link>
      </div>
    </div>
  );
}
