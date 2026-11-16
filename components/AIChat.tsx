
"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 Welcome to Pathfinder AI. I'm your career guidance assistant. How can I help you today?",
    },
  ]);

  async function sendMessage() {
    const text = input.trim();

    if (!text || loading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(1),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Chat failed");
      }

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: result.reply,
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {open && (
        <div className="mb-4 flex h-[500px] w-[350px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">

          <div className="flex items-center justify-between bg-cyan-500 p-4 text-slate-950">
            <div className="flex items-center gap-3">
              <Bot size={25} />
              <div>
                <h3 className="font-bold">Pathfinder AI</h3>
                <p className="text-xs">AI Career Assistant</p>
              </div>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                    message.role === "user"
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-cyan-400">
                Pathfinder AI is typing...
              </p>
            )}
          </div>

          <div className="flex gap-2 border-t border-slate-800 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask anything..."
              className="min-w-0 flex-1 rounded-xl bg-slate-900 p-3 text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-cyan-500 p-3 text-slate-950 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-xl transition hover:scale-105"
        aria-label="Open AI chat"
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
