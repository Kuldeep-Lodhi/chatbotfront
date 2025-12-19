export type ChatHistory = {
  role: "user" | "bot";
  content: string;
};

export type ChatSession = {
  id: string;
  chatName: string;
  chatHistoryArray: ChatHistory[];
};
