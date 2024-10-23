// Cloudflare Variables Set Up
type PlatformProxy = import("wrangler").PlatformProxy;
type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

// Import Context Types
type KVSession = import("context/session").KVSession;

export * from "@remix-run/cloudflare";
declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }

  interface CloudflareContext {
    cloudflare: Cloudflare;
  }

  type GetLoadContextArgs = {
    request: Request;
    context: CloudflareContext;
  };

  interface AppLoadContext extends CloudflareContext {
    session: KVSession;
  }
}
