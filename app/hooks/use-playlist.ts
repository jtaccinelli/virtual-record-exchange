import { createContext, useContext } from "react";

const PlaylistContext = createContext<Playlist>({} as Playlist);

export const PlaylistProvider = PlaylistContext.Provider;

export const usePlaylist = (override?: Playlist) => {
  const context = useContext(PlaylistContext);
  return override ?? context;
};
