interface AuthErrorLike {
  message?: string;
  code?: string;
  status?: number;
}

/** Turns BetterAuth error codes into sentences a volunteer can act on. */
export function friendlyAuthError(error: AuthErrorLike | null | undefined, fallback: string): string {
  if (!error) return fallback;
  const code = (error.code ?? "").toUpperCase();

  if (code.includes("USER_ALREADY_EXISTS") || code.includes("ALREADY_EXISTS")) {
    return "An account with this email already exists. Try logging in instead";
  }
  if (code.includes("INVALID_EMAIL_OR_PASSWORD") || code.includes("INVALID_PASSWORD") || error.status === 401) {
    return "That email and password do not match. Please check them and try again";
  }
  if (code.includes("INVALID_EMAIL")) return "Enter a valid email address";
  if (code.includes("PASSWORD_TOO_SHORT")) return "Password must be at least 6 characters long";
  if (code.includes("PROVIDER_NOT_FOUND")) return "Google sign-in is not set up on this site yet";
  if (error.status === 429) return "Too many attempts. Please wait a moment and try again";

  return error.message && error.message.length < 140 ? error.message : fallback;
}
