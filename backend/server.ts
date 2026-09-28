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


async function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid JSON body");
  return parsed as Record<string, unknown>;
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
      if (request.method === "GET" && url.pathname === "/api/goals") { json(response, 200, await repository!.getGoals(session.userId)); return; }
      if (request.method === "GET" && url.pathname === "/api/tasks") { json(response, 200, await repository!.getDueTasks(session.userId)); return; }
      if (request.method === "POST" && url.pathname === "/api/water") { json(response, 201, await repository!.addWaterGlass(session.userId)); return; }
      if (request.method === "GET" && url.pathname === "/api/journal") { json(response, 200, await repository!.getJournalEntries(session.userId)); return; }
      if (request.method === "GET" && url.pathname === "/api/expenses") { json(response, 200, await repository!.getExpenses(session.userId)); return; }
      if (request.method === "POST" && url.pathname === "/api/journal") { const body=await readBody(request); if(typeof body.body!=="string"||!body.body.trim()){json(response,400,{error:"body is required"});return;} json(response,201,await repository!.addJournalEntry(session.userId,body.body.trim())); return; }
      if (request.method === "POST" && url.pathname === "/api/cycle") { const body=await readBody(request); if(typeof body.startDate!=="string"||!body.startDate.trim()){json(response,400,{error:"startDate is required"});return;} json(response,201,await repository!.logPeriod(session.userId,{startDate:body.startDate,flow:typeof body.flow==="string"?body.flow:undefined,endDate:typeof body.endDate==="string"?body.endDate:undefined})); return; }
      if (request.method === "POST" && url.pathname === "/api/cycle/symptoms") { const body=await readBody(request); if(typeof body.symptom!=="string"||!body.symptom.trim()){json(response,400,{error:"symptom is required"});return;} json(response,201,await repository!.logCycleSymptom(session.userId,{symptom:body.symptom.trim(),recordedOn:typeof body.recordedOn==="string"?body.recordedOn:undefined})); return; }
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
