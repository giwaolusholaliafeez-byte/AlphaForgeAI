"use client";

import { useState } from "react";
import { Brain, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AskAlphaForge() {
  const prompts = ["Why did my portfolio move today?", "What is my biggest risk?", "Which position is hurting me most?", "How diversified is my portfolio?"];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    setQuestion(trimmed);
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const response = await fetch("/api/intelligence/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !payload.answer) {
        setError(payload.error ?? "AI copilot is temporarily unavailable.");
        return;
      }
      setAnswer(payload.answer);
    } catch {
      setError("AI copilot is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#00C2A8]/20 bg-gradient-to-br from-[#00C2A8]/10 to-white/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-[#00C2A8]" />
        <div>
          <h2 className="font-medium text-white">Ask AlphaForge</h2>
          <p className="text-xs text-[#A1A7B3]">AI analysis grounded in your current portfolio data</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submit(prompt)}
            disabled={isLoading}
            className="rounded-full border border-white/[0.08] px-3 py-2 text-left text-xs text-[#CBD5E1] hover:border-[#00C2A8]/40 hover:text-white disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(question);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about your portfolio..."
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#0B0F1A] px-3 text-sm text-white outline-none focus:border-[#00C2A8] disabled:opacity-50"
        />
        <Button type="submit" size="icon" aria-label="Ask AlphaForge" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.06] p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {answer && !error && (
        <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#0B0F1A] p-4">
          <p className="text-xs uppercase tracking-wider text-[#00C2A8]">AlphaForge analysis</p>
          <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">{answer}</p>
          <p className="mt-3 text-[11px] text-[#64748B]">Analysis is based on available portfolio and market data. It is not investment advice.</p>
        </div>
      )}
    </section>
  );
}
