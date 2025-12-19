import { chatArray } from "./SendText";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  allHistory: chatArray[];
  currentId: string | null;
  onNewChat: () => void;
  onLoadChat: (chat: chatArray) => void;
}

export default function Sidebar({ isOpen, setIsOpen, allHistory, currentId, onNewChat, onLoadChat }: SidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
      <div className={`fixed md:relative z-50 w-60 h-full bg-black border-r border-slate-800 flex flex-col transition-all duration-300 ${isOpen ? "left-0" : "-left-full md:left-0"}`}>
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-slate-100 font-bold mb-6 px-1 uppercase">History</h2>
          <button onClick={onNewChat} className="w-full bg-black hover:bg-slate-700 border border-slate-700 py-2 rounded-md mb-6 text-white">+ New Session</button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {allHistory.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => onLoadChat(chat)} 
                className={`p-2 rounded cursor-pointer truncate ${currentId === chat.id ? "bg-slate-800 text-indigo-300" : "text-slate-400 hover:bg-slate-800/50"}`}
              >
                {chat.chatName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}