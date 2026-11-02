import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// No baseURL on purpose: BetterAuth lives in this same Next.js app at /api/auth.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});
