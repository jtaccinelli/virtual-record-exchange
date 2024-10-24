import { SpotifyAuth } from "./auth";

export class SpotifyClient {
  static async init(auth: SpotifyAuth) {
    return new this(auth);
  }

  accessToken;

  constructor(auth: SpotifyAuth) {
    this.accessToken = auth.accessToken;
  }

  async fetch<Response>(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken) return undefined;

    const headers = new Headers(options?.headers ?? {});
    headers.set("Authorization", `Bearer ${this.accessToken}`);

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    return await response.json<Response>();
  }
}
