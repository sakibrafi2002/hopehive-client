import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { authDb } from "./mongodb";

const baseURL = (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(authDb),
  trustedOrigins: [baseURL],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  // Google is only switched on when its keys exist, so the app still runs without them.
  ...(googleId && googleSecret
    ? { socialProviders: { google: { clientId: googleId, clientSecret: googleSecret } } }
    : {}),

  plugins: [
    // Issues short lived JWTs signed with a private key. The Express API verifies them with the public keys
    // served at /api/auth/jwks, so the API never needs the signing secret.
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "15m",
        definePayload: (session) => ({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      },
    }),
    // Must stay last: lets server actions and server components set the session cookie.
    nextCookies(),
  ],
});
