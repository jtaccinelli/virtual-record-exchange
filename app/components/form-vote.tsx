import { useMemo } from "react";
import { Form } from "@remix-run/react";

import { configs } from "context/database";

import { FieldUsers } from "@app/components/field-users";
import { FieldTextarea } from "@app/components/field-textarea";
import { FieldTracks } from "@app/components/field-tracks";

type Props = {
  playlist: Playlist;
  users: User[];
  voter?: User;
  config: typeof configs.$inferSelect;
};

export function FormVote({ users, playlist, config, voter }: Props) {
  const filteredTracks = useMemo(() => {
    const userId = voter?.id;
    return playlist.tracks.items
      .filter((item) => (userId ? item.added_by.id !== userId : true))
      .map((item) => item.track)
      .filter((item) => !!item);
  }, [playlist]);

  const filteredUsers = useMemo(() => {
    const userId = voter?.id;
    return users.filter((user) => (userId ? user.id !== userId : true));
  }, [users]);

  return (
    <Form
      className="flex flex-col divide-y divide-gray-800"
      action="/api/vote/create"
      method="post"
    >
      <input type="hidden" name="playlist-id" value={playlist.id} />
      <input type="hidden" name="voter-id" value={voter?.id} />
      <FieldTracks tracks={filteredTracks} max={config.track_vote_count ?? 3} />
      <FieldUsers
        users={filteredUsers}
        max={config.contributor_vote_count ?? 1}
      />
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
