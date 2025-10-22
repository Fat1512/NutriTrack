import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import useChatAI from "./useChatAI";
import ReactMarkdown from "react-markdown";
type Message = {
  role: "user" | "bot";
  text: string;
  conversationId?: string;
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
  const [conversationId, setConversationId] = useState(null);
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
      conversationId,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    chatWithAI(
      { query: text, conversationId: conversationId },
      {
        onSuccess: ({ answer, conversation_id }) => {
          setConversationId(conversation_id);
          setMessages((prev) => [...prev, { role: "bot", text: answer }]);
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
        <div className="flex flex-col gap-3 p-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm whitespace-pre-wrap animate-slide-up ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-1 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-5">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-5">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
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
            disabled={isPending}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 
        ${
          isPending
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
        }
      `}
          >
            {isPending ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <FaPaperPlane className="w-4 h-4 rotate-45" />
              </>
            )}
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
