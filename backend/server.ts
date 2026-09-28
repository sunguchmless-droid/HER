import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { requireSession, TokenVerifier } from "./auth";
import { buildDashboard, DashboardRepository } from "./dashboard";
import { createSupabaseConfig, verifySupabaseAccessToken } from "./supabase";
import { createSupabaseRepository, HerRepository } from "./repository";

export type ServerContext = { userId: string; accessToken: string };
export type HerServerOptions = { verifyToken?: TokenVerifier; repositoryFactory?: (accessToken: string) => HerRepository };

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

export function createHerServer(options: HerServerOptions = {}) {
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
    if (!options.verifyToken) {
      json(response, 501, { error: "Authentication adapter not configured" });
      return;
    }

    try {
      const session = await requireSession(token, options.verifyToken);
      const repository = options.repositoryFactory?.(session.accessToken);
      if (request.method === "GET" && url.pathname === "/api/dashboard") {
        if (!repository) {
          json(response, 501, { error: "Repository not configured" });
          return;
        }
        const dashboard = await buildDashboard(session.userId, repository);
        json(response, 200, dashboard);
        return;
      }
      json(response, 404, { error: "Route not implemented" });
    } catch (error) {
      json(response, 401, { error: error instanceof Error ? error.message : "Authentication failed" });
    }
  });
}

if (process.env.NODE_ENV !== "test") {
  const config = createSupabaseConfig(process.env);
  const port = Number(process.env.PORT ?? 3000);
  createHerServer({
    verifyToken: (accessToken) => verifySupabaseAccessToken(config, accessToken),
    repositoryFactory: (accessToken) => createSupabaseRepository(accessToken, config.url, config.anonKey),
  }).listen(port, () => console.log(`HER API listening on ${port}`));
}
