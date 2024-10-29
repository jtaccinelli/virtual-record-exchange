import { Link } from "@remix-run/react";

import { DialogBasic } from "./dialog-basic";

export function DialogCantVote() {
  return (
    <DialogBasic
      open
      emoji="🧑‍⚖️"
      heading="You can't vote!"
      subheading="You didn't contribute to this playlist."
    >
      <Link to="/" className="btn btn-primary">
        Back Home
      </Link>
    </DialogBasic>
  );
}
