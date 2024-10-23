// Cloudflare Variables Set Up
type PlatformProxy = import("wrangler").PlatformProxy;
type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

interface CloudflareContext {
  cloudflare: Cloudflare;
}

type GetLoadContextArgs = {
  request: Request;
  context: CloudflareContext;
};

declare module "@remix-run/cloudflare" {
  interface AppLoadContext extends CloudflareContext {}

  interface Future {
    v3_singleFetch: true;
  }
}
