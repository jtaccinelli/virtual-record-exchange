import { Form } from "@remix-run/react";

import { FieldPlaylistInput } from "@app/components/field-playlist-input";
import { FieldTabs } from "@app/components/field-tabs";

export function FormCreate() {
  return (
    <Form
      className="relative flex flex-col divide-y divide-gray-950"
      action="/api/config/create"
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
      <div className="sticky bottom-0 bg-gray-900 px-6 py-4">
        <button type="submit" className="btn btn-primary self-start">
          Create Voting Form
        </button>
      </div>
    </Form>
  );
}
