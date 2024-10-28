import { Form } from "@remix-run/react";

import { FieldTabs } from "./field-tabs";
import { FieldPlaylistInput } from "./field-playlist-input";

export function FormCreate() {
  return (
    <Form
      className="flex flex-col gap-6 px-6 py-12"
      action="/api/vote/create"
      method="post"
    >
      <FieldPlaylistInput />
      <FieldTabs
        name="track-vote-count"
        label="How many tracks should people be able to vote for?"
        defaultValue={3}
        values={[1, 2, 3, 4, 5]}
      />
      <FieldTabs
        name="contributor-vote-count"
        label="How many best contributors should people be able to vote for?"
        defaultValue={1}
        values={[1, 2, 3, 4, 5]}
      />
      <button type="submit" className="btn btn-primary self-start">
        Create Voting Form
      </button>
    </Form>
  );
}
