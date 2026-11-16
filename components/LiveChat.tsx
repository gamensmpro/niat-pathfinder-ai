
"use client";

import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Trash2
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const knowledgeBase = [
  {
    keywords: ["hi", "hello", "hey", "good morning", "good evening"],
    answer:
      "Hello! Welcome to NIAT Pathfinder AI. 😊 How can I help you today?"
  },
  {
    keywords: ["what is niat", "about niat", "niat"],
    answer:
      "NIAT (NxtWave of Innovation in Advanced Technologies) is an industry-focused technology upskilling initiative associated with undergraduate programs at partner universities. It focuses on helping students develop practical technology skills."
  },
  {
    keywords: ["degree", "university", "degree certificate"],
    answer:
      "The degree is awarded by the respective partner university, not NIAT itself. Please confirm the specific university and degree applicable to your admission."
  },
  {
    keywords: ["admission", "apply", "join", "eligibility"],
    answer:
      "Admission eligibility and selection requirements depend on the applicable program and university. Please check the official NIAT website or speak with an admissions counsellor for current details."
  },
  {
    keywords: ["course", "curriculum", "subjects", "learn"],
    answer:
      "NIAT focuses on practical technology learning and industry-oriented skills. For the current curriculum, subjects and program structure, please consult the official NIAT information."
  },
  {
    keywords: ["placement", "job", "career", "salary"],
    answer:
      "NIAT focuses on developing industry-ready skills. Actual career outcomes depend on individual performance and opportunities. I recommend verifying placement statistics and salary information with an authorized NIAT representative."
  },
  {
    keywords: ["fees", "fee", "scholarship", "cost"],
    answer:
      "Fees and scholarship availability can vary by program and university. Please contact an authorized NIAT admissions counsellor for the latest verified details."
  },
  {
    keywords: ["parent", "parents", "father", "mother"],
    answer:
      "Welcome! We understand that choosing an undergraduate program is an important family decision. You should evaluate the degree-awarding university, curriculum, fees, student support and career opportunities before deciding."
  },
  {
    keywords: ["contact", "counsellor", "counselor", "phone"],
    answer:
      "You can visit https://www.niatindia.com/ to find official NIAT information and admission enquiry options."
  },
  {
    keywords: ["thank", "thanks"],
    answer:
      "You're welcome! 😊 Feel free to ask me another question about NIAT."
  }
];

function getOfflineReply(message: string): string {
  const input = message.toLowerCase().trim();

  if (!input) {
    return "Please type a question.";
  }

  const match = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => {
      if (keyword.includes(" ")) {
        return input.includes(keyword);
      }

      return new RegExp(
        `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      ).test(input);
    })
  );

  if (match) {
    return match.answer;
  }

  return (
    "I don't have verified information about that question yet. " +
    "I can help with NIAT admissions, programs, degree information, " +
    "fees, scholarships and career opportunities. " +
    "You can also visit https://www.niatindia.com/ for official information."
  );
}

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 Welcome to NIAT Pathfinder AI.\n\nI'm your offline education assistant. Ask me about NIAT, admissions, courses, degrees, fees or career opportunities."
    }
  ]);

  function sendMessage() {
    const text = message.trim();

    if (!text) return;

    const reply = getOfflineReply(text);

    setMessages((previous) => [
      ...previous,
      { role: "user", content: text },
      { role: "assistant", content: reply }
    ]);

    setMessage("");
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello again! 👋 How can I help you with NIAT?"
      }
    ]);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">

      {open && (
        <div className="mb-4 flex h-[520px] w-[350px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1224] shadow-2xl">

          <div className="flex items-center justify-between bg-cyan-500 p-4 text-slate-950">

            <div className="flex items-center gap-3">
              <Bot size={26} />

              <div>
                <h3 className="font-bold">
                  NIAT Pathfinder AI
                </h3>

                <p className="text-xs">
                  Offline Assistant · Available locally
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={clearChat} aria-label="Clear chat">
                <Trash2 size={18} />
              </button>

              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={22} />
              </button>
            </div>

          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                    item.role === "user"
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

          </div>

          <div className="flex gap-2 border-t border-slate-700 p-3">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about NIAT..."
              className="min-w-0 flex-1 rounded-xl bg-slate-800 p-3 text-sm text-white outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="rounded-xl bg-cyan-500 p-3 text-slate-950 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>

          </div>

        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Open AI chat"
        className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-xl transition hover:scale-105"
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

    </div>
  );
}
