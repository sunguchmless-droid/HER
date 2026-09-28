export type VerifiedSession = { userId: string; accessToken: string };

export type TokenVerifier = (accessToken: string) => Promise<VerifiedSession | null>;

export function requireSession(token: string | null, verify: TokenVerifier): Promise<VerifiedSession> {
  if (!token) return Promise.reject(new Error("Authentication required"));
  return verify(token).then((session) => {
    if (!session) throw new Error("Invalid session");
    return session;
  });
}
