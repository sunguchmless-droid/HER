type AiPermissions = {
  access_goals?: boolean; access_tasks?: boolean; access_money?: boolean;
  can_create_goals?: boolean; can_create_reminders?: boolean; can_add_expenses?: boolean;
};
type AiContext = { goals?: unknown[]; tasks?: unknown[]; expenses?: unknown[] };

export async function askOpenAI(apiKey: string, message: string, context: AiContext, permissions: AiPermissions) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
      instructions: "You are HER, a private everyday life assistant. Be warm, concise and practical. Never invent user data. Only request an action when the user clearly asks to create or add something. Respect permissions. Return only JSON matching the schema.",
      input: JSON.stringify({ message, context, permissions }),
      text: {
        format: {
          type: "json_schema",
          name: "her_ai_result",
          strict: true,
          schema: {
            type: "object", additionalProperties: false,
            properties: {
              reply: { type: "string" },
              action: {
                type: "object", additionalProperties: false,
                properties: {
                  type: { type: "string", enum: ["create_goal","create_task","create_reminder","add_expense","none"] },
                  title: { type: "string" },
                  targetAmount: { type: ["number","null"] },
                  deadline: { type: ["string","null"] },
                  dueDate: { type: ["string","null"] },
                  category: { type: ["string","null"] },
                  amount: { type: ["number","null"] },
                  date: { type: ["string","null"] }
                },
                required: ["type","title","targetAmount","deadline","dueDate","category","amount","date"]
              }
            },
            required: ["reply","action"]
          }
        }
      }
    })
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const payload = await response.json() as { output_text?: string };
  if (!payload.output_text) throw new Error("OpenAI returned no structured output.");
  return JSON.parse(payload.output_text) as { reply: string; action: Record<string, unknown> };
}
