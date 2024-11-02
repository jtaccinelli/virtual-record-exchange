type User = SpotifyApi.UserProfileResponse;

type UserPublic = SpotifyApi.UserObjectPublic;

type Playlist = SpotifyApi.PlaylistObjectFull;

type EnrichedPlaylist = {
  data: Playlist;
  addedBy?: UserPublic;
  isOpen?: boolean;
  hasVoted?: boolean;
  hasCreated?: boolean;
};
