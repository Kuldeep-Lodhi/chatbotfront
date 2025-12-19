export default function ChatInput({ inputmsg, setInputmsg, handleApiCall, isStream, handleAbort }: any) {
  return (
    <footer className="absolute bottom-0 left-0 w-full p-4 ">
      <div className="max-w-2xl mx-auto">
        <div className="border bg-black border-slate-800 rounded-lg p-1.5 flex items-end gap-2 backdrop-blur">
          <textarea 
            value={inputmsg}
            onChange={(e) => setInputmsg(e.target.value)}
            onKeyDown={(e) => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleApiCall(); } }}
            placeholder="Type for response"
            className="flex-1 bg-transparent outline-none p-2 resize-none max-h-32 text-xs"
            rows={1}
          />
          {isStream ? (
            <button onClick={handleAbort} className="h-7 w-7 bg-red-900/20 text-red-400 rounded">■</button>
          ) : (
            <button onClick={handleApiCall} disabled={!inputmsg.trim()} className="h-7 w-7 bg-indigo-600 text-white rounded">↑</button>
          )}
        </div>
      </div>
    </footer>
  );
}