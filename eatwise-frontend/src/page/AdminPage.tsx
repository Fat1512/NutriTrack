/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { AI_REQUEST } from "../utils/axiosConfig";

interface Message {
  sender: "user" | "bot";
  text: string;
  tokens?: number;
}

interface WatcherStatus {
  local: boolean;
  rss: boolean;
}
type WatcherName = "local" | "rss";

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
    document.body.classList.add("admin-page");

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);
  const [watcherStatus, setWatcherStatus] = useState<WatcherStatus | null>(
    null
  );
  const [watcherError, setWatcherError] = useState<string>("");

  const API_URL = "/api";

  useEffect(() => {
    fetchDocuments();
    fetchWatcherStatus();
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

  const fetchWatcherStatus = async () => {
    try {
      const response = await AI_REQUEST.get<{ watchers: WatcherStatus }>(
        `/watcher/status`
      );
      setWatcherStatus(response.data.watchers);
      setWatcherError("");
    } catch (error) {
      console.error("Lỗi khi tải trạng thái watcher:", error);
      setWatcherError("Không thể tải trạng thái watcher.");
    }
  };

  const handleToggleWatcher = async (
    watcher: WatcherName,
    enabled: boolean
  ) => {
    try {
      setWatcherError("");
      setWatcherStatus((prev) =>
        prev ? { ...prev, [watcher]: enabled } : null
      );

      await AI_REQUEST.post(`/watcher/toggle`, {
        watcher: watcher,
        enabled: enabled,
      });
      await fetchWatcherStatus();
    } catch (error) {
      console.error(
        `Lỗi khi ${enabled ? "bật" : "tắt"} ${watcher} watcher:`,
        error
      );
      setWatcherError(`Không thể thay đổi trạng thái ${watcher}.`);
      await fetchWatcherStatus();
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

      <div className="admin-tab-content">
        {activeTab === "manage" && (
          <div className="admin-section">
            <h2>Quản lý Tài liệu</h2>

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

        <div className="watcher-controls section">
          <h3>Kiểm soát Watcher Tự động</h3>
          {watcherError && <p className="status-text error">{watcherError}</p>}
          {!watcherStatus ? (
            <p>Đang tải trạng thái...</p>
          ) : (
            <div className="watcher-status-list">
              <div className="watcher-item">
                <span>📁 Watcher Thư mục (Local)</span>
                <span
                  className={`status-badge ${
                    watcherStatus.local ? "enabled" : "disabled"
                  }`}
                >
                  {watcherStatus.local ? "Đang Bật" : "Đang Tắt"}
                </span>
                <div className="watcher-buttons">
                  <button
                    onClick={() => handleToggleWatcher("local", true)}
                    disabled={watcherStatus.local}
                    className="toggle-btn"
                  >
                    Bật
                  </button>
                  <button
                    onClick={() => handleToggleWatcher("local", false)}
                    disabled={!watcherStatus.local}
                    className="toggle-btn"
                  >
                    Tắt
                  </button>
                </div>
              </div>

              <div className="watcher-item">
                <span>📡 Watcher Tin tức (RSS)</span>
                <span
                  className={`status-badge ${
                    watcherStatus.rss ? "enabled" : "disabled"
                  }`}
                >
                  {watcherStatus.rss ? "Đang Bật" : "Đang Tắt"}
                </span>
                <div className="watcher-buttons">
                  <button
                    onClick={() => handleToggleWatcher("rss", true)}
                    disabled={watcherStatus.rss}
                    className="toggle-btn"
                  >
                    Bật
                  </button>
                  <button
                    onClick={() => handleToggleWatcher("rss", false)}
                    disabled={!watcherStatus.rss}
                    className="toggle-btn"
                  >
                    Tắt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeTab === "chat" && (
          <div className="admin-section">
            <div className="admin-chat-header">
              <h2>Chat với Tài liệu</h2>
              <button onClick={startNewChat} className="admin-new-chat-btn">
                ✨ Bắt đầu Chat mới
              </button>
            </div>

            <div className="admin-chat-window">
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
