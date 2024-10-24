// -- SESSION HANDLER

import {
  CloudflareContext,
  createCookie,
  createWorkersKVSessionStorage,
  Session,
  SessionStorage,
} from "@remix-run/cloudflare";

export class KVSession {
  // -- CLASS STATIC VARIABLES & METHODS

  static COOKIE_KEY = "__session";
  static COOKIE_SECRET = "r3m1xr0ck5";

  static KEY__ACCESS_TOKEN = "__spotifyAccessToken";
  static KEY__REFERSH_TOKEN = "__spotifyRefreshToken";
  static KEY__EXPIRES_AT = "__spotifyExpiresAt";

  static async init(request: Request, context: CloudflareContext) {
    const cookie = createCookie(KVSession.COOKIE_KEY, {
      secrets: [KVSession.COOKIE_SECRET],
      sameSite: "lax",
    });

    const storage = createWorkersKVSessionStorage({
      kv: context.cloudflare.env.SESSION,
      cookie: cookie,
    });

    const session = await storage
      .getSession(request.headers.get("Cookie"))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  // -- CLASS INSTANCE VARIABLES & METHODS

  storage;
  session;

  constructor(storage: SessionStorage, session: Session) {
    this.storage = storage;
    this.session = session;
  }

  get id() {
    return this.session.id;
  }

  get has() {
    return this.session.has;
  }

  get get() {
    return this.session.get;
  }

  get flash() {
    return this.session.flash;
  }

  get unset() {
    return this.session.unset;
  }

  get set() {
    return this.session.set;
  }

  destroy() {
    return this.storage.destroySession(this.session);
  }

  commit() {
    return this.storage.commitSession(this.session);
  }
}
