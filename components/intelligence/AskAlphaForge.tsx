"use client";

import { useState } from "react";
import { Brain, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Turn {
  id: string;
  question: string;
  answer?: string;
  error?: string;
}

export default function AskAlphaForge() {
  const prompts = ["Why did my portfolio move today?", "What is my biggest risk?", "Which position is hurting me most?", "How diversified is my portfolio?"];
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    setQuestion("");
    setIsLoading(true);
    const id = `${Date.now()}`;
    setTurns((current) => [...current, { id, question: trimmed }]);
    try {
      const response = await fetch("/api/intelligence/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !payload.answer) {
        setTurns((current) => current.map((turn) => (turn.id === id ? { ...turn, error: payload.error ?? "AI copilot is temporarily unavailable." } : turn)));
        return;
      }
      setTurns((current) => current.map((turn) => (turn.id === id ? { ...turn, answer: payload.answer } : turn)));
    } catch {
      setTurns((current) => current.map((turn) => (turn.id === id ? { ...turn, error: "AI copilot is temporarily unavailable." } : turn)));
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

      {turns.length === 0 && (
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
      )}

      {turns.length > 0 && (
        <div className="mt-4 max-h-[420px] space-y-4 overflow-y-auto pr-1">
          {turns.map((turn) => (
            <div key={turn.id} className="space-y-2">
              <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-white/[0.06] px-3 py-2 text-sm text-white">
                {turn.question}
              </div>
              {turn.answer && (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/10">
                    <Sparkles className="h-3.5 w-3.5 text-[#00C2A8]" />
                  </span>
                  <div className="max-w-[92%] rounded-lg rounded-tl-sm border border-white/[0.06] bg-[#0B0F1A] px-3 py-2.5">
                    <p className="text-sm leading-6 text-[#CBD5E1]">{turn.answer}</p>
                  </div>
                </div>
              )}
              {turn.error && (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <Brain className="h-3.5 w-3.5 text-red-400" />
                  </span>
                  <div className="max-w-[92%] rounded-lg rounded-tl-sm border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5">
                    <p className="text-sm text-red-400">{turn.error}</p>
                  </div>
                </div>
              )}
              {!turn.answer && !turn.error && (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/10">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00C2A8]" />
                  </span>
                  <p className="text-xs text-[#5B6472]">Analyzing your portfolio…</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
          placeholder={turns.length ? "Ask a follow-up..." : "Ask about your portfolio..."}
          aria-label="Ask AlphaForge a question"
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#0B0F1A] px-3 text-sm text-white outline-none focus:border-[#00C2A8] disabled:opacity-50"
        />
        <Button type="submit" size="icon" aria-label="Ask AlphaForge" disabled={isLoading || !question.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
      <p className="mt-3 text-[11px] text-[#64748B]">Analysis is based on available portfolio and market data. It is not investment advice.</p>
    </section>
  );
}
