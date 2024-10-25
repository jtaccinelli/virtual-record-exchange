import { Form } from "@remix-run/react";

import { FieldTracks } from "@app/components/field-tracks";
import { FieldUsers } from "@app/components/field-users";
import { FieldTextarea } from "@app/components/field-textarea";

type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
  users: SpotifyApi.UserProfileResponse[];
};

export function FormVote({ tracks, users }: Props) {
  return (
    <Form className="flex flex-col gap-12 px-6 py-12">
      <FieldTracks tracks={tracks} />
      <FieldUsers users={users} />
      <FieldTextarea
        name="honourable-mentions"
        label="Are there any tracks or contributors worthy of an honourable mention?"
      />
      <FieldTextarea
        name="shame-votes"
        label="Are there any tracks or contributors that deserve shame votes?"
      />
      <button className="btn btn-primary self-start">Submit Vote</button>
    </Form>
  );
}
