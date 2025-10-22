import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { AI_REQUEST } from "../utils/axiosConfig";

interface Message {
  sender: "user" | "bot";
  text: string;
  tokens?: number;
}

type ActiveTab = "manage" | "chat";

function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const [chatInput, setChatInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>("manage");

  useEffect(() => {
    // Add admin-page class to body when component mounts
    document.body.classList.add("admin-page");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await AI_REQUEST.get<{ documents: string[] }>(
        `/rag/documents`
      );
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài liệu:", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Vui lòng chọn một file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploadStatus(`Đang tải lên ${file.name}...`);

    try {
      const response = await AI_REQUEST.post(`/rag/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus(`Tải lên thành công: ${response.data.filename}`);
      setFile(null);
      fetchDocuments();
    } catch (error) {
      console.error("Lỗi khi upload:", error);
      setUploadStatus("Tải lên thất bại.");
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${filename} không?`)) {
      return;
    }
    try {
      await AI_REQUEST.delete(`/rag/document`, {
        data: { filename: filename },
      });
      fetchDocuments();
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
    }
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: Message = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    const payload: { query: string; conversation_id?: string } = {
      query: chatInput,
    };

    if (conversationId) {
      payload.conversation_id = conversationId;
    }

    try {
      const response = await AI_REQUEST.post(`/rag/chat`, payload);

      const { answer, token_usage, conversation_id } = response.data;

      if (conversation_id) {
        setConversationId(conversation_id);
      }

      const botMessage: Message = {
        sender: "bot",
        text: answer,
        tokens: token_usage?.total_tokens || 0,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi chat:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Đã xảy ra lỗi, không thể lấy câu trả lời.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">🤖 Document Assistant</h1>

      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          <span>📁 Quản lý Tệp</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <span>💬 Thử Chat</span>
        </button>
      </div>

      {/* --- TAB --- */}
      <div className="admin-tab-content">
        {/* --- TAB 1: QUẢN LÝ TỆP --- */}
        {activeTab === "manage" && (
          <div className="admin-section">
            <h2>Quản lý Tài liệu</h2>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="admin-form-group">
              <h3>Tải lên tài liệu (PDF, DOCX, MD)</h3>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.md,.txt"
                className="admin-file-input"
              />
              <button
                type="submit"
                disabled={!file}
                className="admin-upload-btn"
              >
                📤 Tải lên
              </button>
              {uploadStatus && (
                <p
                  className={`admin-status ${
                    uploadStatus.includes("thành công")
                      ? "success"
                      : uploadStatus.includes("thất bại")
                      ? "error"
                      : ""
                  }`}
                >
                  {uploadStatus}
                </p>
              )}
            </form>

            {/* Danh sách Document */}
            <div className="admin-doc-list-container">
              <h3>Tài liệu đã tải lên</h3>
              {documents.length === 0 ? (
                <div className="admin-empty-state">
                  <p>Chưa có tài liệu nào được tải lên.</p>
                  <p>Hãy tải lên tài liệu đầu tiên của bạn!</p>
                </div>
              ) : (
                <ul className="admin-doc-list">
                  {documents.map((doc) => (
                    <li key={doc}>
                      <span>{doc}</span>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="admin-delete-btn"
                      >
                        🗑️ Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: CHATBOT --- */}
        {activeTab === "chat" && (
          <div className="admin-section">
            <div className="admin-chat-header">
              <h2>Chat với Tài liệu</h2>
              <button onClick={startNewChat} className="admin-new-chat-btn">
                ✨ Bắt đầu Chat mới
              </button>
            </div>

            <div className="admin-chat-window">
              {/* Các tin nhắn */}
              <div className="admin-chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`admin-message ${msg.sender}`}>
                    <p>{msg.text}</p>
                    {msg.sender === "bot" && msg.tokens !== undefined && (
                      <span className="admin-token-count">
                        {msg.tokens} tokens
                      </span>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="admin-message bot">
                    <p>
                      Bot đang nhập<span className="admin-loading-dots"></span>
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={handleChatSubmit}
                className="admin-chat-input-form"
              >
                <input
                  className="admin-chat-input"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Hỏi bot về tài liệu của bạn..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="admin-send-btn"
                >
                  {isLoading ? "⏳" : "🚀"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
