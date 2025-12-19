"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export type chatHistory = { role: "user" | "bot"; content: string };
export type chatArray = { id: string; chatName: string; chatHistoryArray: chatHistory[] };

export default function SendText() {
  const [inputmsg, setInputmsg] = useState<string>("");
  const [history, setHistory] = useState<chatHistory[]>([]);
  const [allChatHistory, setAllChatHistory] = useState<chatArray[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isStream, setIsStream] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  // Persistence Logic
  useEffect(() => {
    const storedAll = localStorage.getItem("vault_chat_history");
    const activeId = localStorage.getItem("active_vault_id");
    if (storedAll) {
      const parsedAll: chatArray[] = JSON.parse(storedAll);
      setAllChatHistory(parsedAll);
      if (activeId) {
        const activeSession = parsedAll.find((s) => s.id === activeId);
        if (activeSession) { setHistory(activeSession.chatHistoryArray); setCurrentChatId(activeId); }
      }
    }
  }, []);

  useEffect(() => {
    if (allChatHistory.length > 0) localStorage.setItem("vault_chat_history", JSON.stringify(allChatHistory));
  }, [allChatHistory]);

  const syncToGlobalHistory = (chatId: string, updatedHistory: chatHistory[]) => {
    setAllChatHistory((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === chatId);
      if (existingIndex !== -1) {
        const newAll = [...prev];
        newAll[existingIndex] = { ...newAll[existingIndex], chatHistoryArray: updatedHistory };
        return newAll;
      } else {
        return [{ id: chatId, chatName: updatedHistory[0].content.substring(0, 30) + "...", chatHistoryArray: updatedHistory }, ...prev];
      }
    });
  };

  const handleApiCall = async () => {
    if (!inputmsg.trim() || isStream) return;
    abortRef.current = new AbortController();
    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) { setCurrentChatId(chatId); localStorage.setItem("active_vault_id", chatId); }

    const userMsg: chatHistory = { role: "user", content: inputmsg };
    const historyWithUser = [...history, userMsg];
    setHistory(historyWithUser);
    setInputmsg("");
    syncToGlobalHistory(chatId, historyWithUser);

    try {
      const response = await fetch("https://backend-chat-2-5nc3.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputmsg }),
        signal: abortRef.current.signal,
      });

      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      setIsStream(true);
      let botContent = "";
      setHistory((prev) => [...prev, { role: "bot", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botContent += decoder.decode(value);
        setHistory((prev) => {
          const newArr = [...prev];
          newArr[newArr.length - 1] = { role: "bot", content: botContent };
          return newArr;
        });
      }
      syncToGlobalHistory(chatId, [...historyWithUser, { role: "bot", content: botContent }]);
    } catch (e) { console.error(e); } finally { setIsStream(false); }
  };

  return (
    <div className="flex h-screen w-full bg-orange-300 text-slate-200 overflow-hidden font-sans text-xs">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        allHistory={allChatHistory} 
        currentId={currentChatId} 
        onNewChat={() => { setHistory([]); setCurrentChatId(null); localStorage.removeItem("active_vault_id"); setIsSidebarOpen(false); }}
        onLoadChat={(s) => { setHistory(s.chatHistoryArray); setCurrentChatId(s.id); localStorage.setItem("active_vault_id", s.id); setIsSidebarOpen(false); }}
      />
      <div className="flex-1 flex flex-col relative min-w-0">
        <Header setIsSidebarOpen={setIsSidebarOpen} currentChatId={currentChatId} history={history} isStream={isStream} />
        <ChatMessages history={history} />
        <ChatInput 
          inputmsg={inputmsg} 
          setInputmsg={setInputmsg} 
          handleApiCall={handleApiCall} 
          isStream={isStream} 
          handleAbort={() => { abortRef.current?.abort(); setIsStream(false); }} 
        />
      </div>
    </div>
  );
}