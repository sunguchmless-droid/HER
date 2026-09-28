import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";

export type ServerContext = { userId: string; accessToken: string };

export function getBearerToken(request: IncomingMessage): string | null {
  const value = request.headers.authorization;
  if (!value?.startsWith("Bearer ")) return null;
  const token = value.slice("Bearer ".length).trim();
  return token || null;
}

export function json(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
}

export function createHerServer() {
  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && url.pathname === "/health") {
      json(response, 200, { ok: true, service: "her-api" });
      return;
    }

    const token = getBearerToken(request);
    if (!token) {
      json(response, 401, { error: "Authentication required" });
      return;
    }

    // Token verification is intentionally isolated here. The production
    // adapter will verify the Supabase JWT and derive the user ID from it.
    const context: ServerContext = { userId: "verified-user", accessToken: token };

    if (request.method === "GET" && url.pathname === "/api/dashboard") {
      json(response, 200, { userId: context.userId, goals: [], tasks: [], waterGlasses: 0 });
      return;
    }

    json(response, 404, { error: "Route not implemented" });
  });
}

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3000);
  createHerServer().listen(port, () => console.log(`HER API listening on ${port}`));
}
