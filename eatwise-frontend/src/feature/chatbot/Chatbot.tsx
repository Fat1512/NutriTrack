import { useState, useRef, useEffect } from "react";
import useChatAI from "./useChatAI";

type Message = {
  role: "user" | "bot";
  text: string;
};
const INIT_MESSAGE: Message[] = [
  {
    role: "bot",
    text: "Xin chào 👋! Mình là trợ lý ảo của bạn. Hãy trò chuyện cùng mình nhé!",
  },
];

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGE);
  const { isPending, chatWithAI } = useChatAI();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, isPending]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      role: "user",
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    chatWithAI(
      { query: text },
      {
        onSuccess: ({ data }) => {
          setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
        },
      }
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-indigo-100 via-white to-indigo-50 text-gray-800">
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 animate-fade-in"
      >
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm animate-slide-up ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isPending && <TypingDots />}
      </main>

      <footer className="border-t bg-white px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:border-indigo-300"
          />
          <button
            type="submit"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            Gửi
          </button>
        </form>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
      `}</style>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0s]"></span>
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.1s]"></span>
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
    </div>
  );
}
