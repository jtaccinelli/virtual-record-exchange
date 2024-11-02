type User = SpotifyApi.UserProfileResponse;

type UserPublic = SpotifyApi.UserObjectPublic;

type Playlist = SpotifyApi.PlaylistObjectFull;

type Track = SpotifyApi.TrackObjectFull;

type Image = SpotifyApi.ImageObject;

type EnrichedPlaylist = {
  data: Playlist;
  addedBy?: UserPublic;
  isOpen?: boolean;
  hasVoted?: boolean;
  hasCreated?: boolean;
};
