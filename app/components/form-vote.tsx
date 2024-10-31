import { Form } from "@remix-run/react";

import { FieldTracks } from "@app/components/field-tracks";
import { FieldUsers } from "@app/components/field-users";
import { FieldTextarea } from "@app/components/field-textarea";
import { configs } from "context/database";

type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
  users: SpotifyApi.UserProfileResponse[];
  playlist: SpotifyApi.PlaylistObjectFull;
  config: typeof configs.$inferSelect;
};

export function FormVote({ tracks, users, playlist, config }: Props) {
  return (
    <Form
      className="flex flex-col divide-y divide-gray-800"
      action="/api/vote/create"
      method="post"
    >
      <input type="hidden" name="playlist-id" value={playlist.id} />
      <FieldTracks tracks={tracks} max={config.track_vote_count ?? 3} />
      <FieldUsers users={users} max={config.contributor_vote_count ?? 1} />
      {!config.enable_honourable_mentions ? null : (
        <FieldTextarea
          name="honourable-mentions"
          placeholder="I liked..."
          label="Are there any tracks or contributors worthy of an honourable mention?"
        />
      )}
      {!config.enable_shame_votes ? null : (
        <FieldTextarea
          name="shame-votes"
          placeholder="I didn't like..."
          label="Are there any tracks or contributors that deserve shame votes?"
        />
      )}
      <div className="bg-gray-900 px-6 py-4">
        <button type="submit" className="btn btn-primary">
          Submit Vote
        </button>
      </div>
    </Form>
  );
}
