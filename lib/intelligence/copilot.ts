import type { PortfolioIntelligence } from "./calculations";

export async function answerPortfolioQuestion(context: PortfolioIntelligence, question: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) throw new Error("AI copilot is temporarily unavailable.");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are AlphaForge's portfolio copilot. Answer using only the supplied structured portfolio data. Never invent holdings, prices, or news that isn't in the data. If the data needed to answer isn't present, say so plainly instead of guessing. Never give buy/sell instructions or guaranteed predictions — explain facts and considerations only. Keep answers under 120 words.",
        },
        { role: "user", content: `Question: ${question}\n\nPortfolio data:\n${JSON.stringify(context)}` },
      ],
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("AI copilot is temporarily unavailable.");
  const payload = await response.json() as { output_text?: string };
  if (!payload.output_text) throw new Error("AI copilot is temporarily unavailable.");
  return payload.output_text.trim();
}
