import { chatHistory } from "./SendText";

export default function Header({ setIsSidebarOpen, currentChatId, history, isStream }: any) {
  return (
    <header className="h-12 border-b bg-amber-500 border-slate-800 flex items-center justify-between px-4 backdrop-blur-md sticky top-0 z-10">
      <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-lg">☰</button>
      <div className="flex items-center gap-3 overflow-hidden px-4">
        <span className="text-[10px] text-slate-500 font-black uppercase">Session: {currentChatId?.slice(-4) || "NEW"}</span>
        <div className="h-3 w-[1px] bg-slate-800" />
        <h3 className="text-xs font-medium text-slate-300 truncate max-w-sm">
          {history.length > 0 ? history[0].content : "Awaiting sync..."}
        </h3>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${isStream ? "bg-indigo-400 animate-pulse" : "bg-slate-700"}`} />
    </header>
  );
}