type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

export function HeaderResults({ playlist }: Props) {
  return (
    <div className="flex flex-col border-b-2 border-gray-800 p-6 pt-20">
      <p className="mb-1 text-sm text-gray-500">Playlist Results</p>
      <h3 className="mb-4 text-xl font-bold">{playlist.name}</h3>
    </div>
  );
}
