// -- SESSION HANDLER

import {
  CloudflareContext,
  createCookie,
  createWorkersKVSessionStorage,
  Session,
  SessionStorage,
} from "@remix-run/cloudflare";

export class KVSession {
  storage;
  session;

  static COOKIE_KEY = "__session";
  static COOKIE_SECRET = "r3m1xr0ck5";

  constructor(storage: SessionStorage, session: Session) {
    this.storage = storage;
    this.session = session;
  }

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
