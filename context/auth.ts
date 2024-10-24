import { Buffer } from "node:buffer";

import { randomState } from "openid-client";

import { KVSession } from "./session";
import { redirect } from "@remix-run/cloudflare";
import { config } from "../config";

export class SpotifyAuth {
  static async init(request: Request, session: KVSession) {
    return new this(request, session);
  }

  // -- CLASS INSTANCE VARIABLES & METHODS
  session: KVSession;

  state: string;
  basicAuthToken: string;
  redirectUri: string;

  accessToken: string;
  refreshToken: string;
  expiresAt: number;

  constructor(request: Request, session: KVSession) {
    this.state = randomState();
    this.session = session;

    // Generate basic authentication header token
    const { clientId, clientSecret, redirectUri } = config.spotify.details;
    const token = `${clientId}:${clientSecret}`;
    this.basicAuthToken = Buffer.from(token).toString("base64");

    // Generate redirect uri based on application site
    const url = new URL(request.url);
    this.redirectUri = `${url.origin}${config.spotify.details.redirectUri}`;

    // Set values fetched from sessions
    this.accessToken = this.session.get(KVSession.KEY__ACCESS_TOKEN);
    this.refreshToken = this.session.get(KVSession.KEY__REFERSH_TOKEN);
    this.expiresAt = this.session.get(KVSession.KEY__EXPIRES_AT);
  }

  // -- SENDS USER TO AUTHORIZATION PLACE

  async authoriseUser() {
    const url = new URL(config.spotify.endpoints.authorise);

    url.searchParams.set("response_type", "code");
    url.searchParams.set("show_dialog", "true");
    url.searchParams.set("state", this.state);
    url.searchParams.set("redirect_uri", this.redirectUri);
    url.searchParams.set("client_id", config.spotify.details.clientId);
    url.searchParams.set("scope", config.spotify.details.scope);

    throw redirect(url.toString());
  }

  // -- FETCHES ACCESS TOKEN W/ USER CODE FROM AUTH

  async signUserIn(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    if (!code) throw Error("No Code Sent");

    const url = new URL(config.spotify.endpoints.token);

    const headers = new Headers();
    headers.set("Authorization", `Basic ${this.basicAuthToken}`);
    headers.set("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("redirect_uri", this.redirectUri);
    body.set("code", code);

    const response = await fetch(url, {
      method: "POST",
      body: body.toString(),
      headers,
    });

    const data = await response.json<{
      expires_in: number;
      access_token: string;
      refresh_token: string;
    }>();

    if (!data.access_token) throw new Error(data.toString());

    const expiresAt = Date.now() + data.expires_in * 1000;

    this.session.set(KVSession.KEY__ACCESS_TOKEN, data.access_token);
    this.session.set(KVSession.KEY__REFERSH_TOKEN, data.refresh_token);
    this.session.set(KVSession.KEY__EXPIRES_AT, expiresAt);

    throw redirect("/", {
      headers: {
        "Set-Cookie": await this.session.commit(),
      },
    });
  }

  async refreshUserToken() {
    const url = new URL(config.spotify.endpoints.token);

    const headers = new Headers();
    headers.set("Authorization", `Basic ${this.basicAuthToken}`);
    headers.set("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", this.refreshToken);

    const response = await fetch(url, {
      method: "POST",
      body: body.toString(),
      headers,
    });

    const data = await response.json<{
      expires_in: number;
      access_token: string;
    }>();

    if (!data.access_token) {
      await this.signUserOut();
    }

    const expiresAt = Date.now() + data.expires_in * 1000;

    this.session.set(KVSession.KEY__ACCESS_TOKEN, data.access_token);
    this.session.set(KVSession.KEY__EXPIRES_AT, expiresAt);

    throw redirect("/", {
      headers: {
        "Set-Cookie": await this.session.commit(),
      },
    });
  }

  async signUserOut() {
    this.session.unset(KVSession.KEY__ACCESS_TOKEN);
    this.session.unset(KVSession.KEY__REFERSH_TOKEN);
    this.session.unset(KVSession.KEY__EXPIRES_AT);

    throw redirect("/", {
      headers: {
        "Set-Cookie": await this.session.commit(),
      },
    });
  }
}
