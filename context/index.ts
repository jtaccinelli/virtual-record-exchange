import { GetLoadContextFunction } from "@remix-run/cloudflare-pages";

export const getLoadContext: GetLoadContextFunction = ({ context }) => {
  return context;
};
