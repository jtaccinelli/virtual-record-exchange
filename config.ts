export const config = {
  spotify: {
    endpoints: {
      authorise: "https://accounts.spotify.com/authorize",
      token: "https://accounts.spotify.com/api/token",
    },
    details: {
      clientId: "ebe9c3147cae485cbc84fe018fb6281b",
      clientSecret: "f2624dfb706547ab96a8283e584168f2",
      scope: "user-read-private user-read-email",
      challengeMethod: "S256",
      redirectUri: "/api/auth/callback",
    },
  },
};