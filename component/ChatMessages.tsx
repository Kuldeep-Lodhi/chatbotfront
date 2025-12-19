import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatHistory } from "./SendText";

export default function ChatMessages({ history }: { history: chatHistory[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32">
      <div className="max-w-3xl mx-auto space-y-6">
        {history.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 font-bold text-[9px] ${msg.role === "user" ? "bg-slate-700" : "bg-indigo-600"}`}>
              {msg.role === "user" ? "U" : "V"}
            </div>
            <div className={`p-3 rounded-lg text-xs max-w-[85%] ${msg.role === "user" ? "bg-slate-800" : "bg-[#1e293b]/50 border border-slate-800"}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}