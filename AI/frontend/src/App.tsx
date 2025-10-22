import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import "./App.css";

interface Document {
	name: string;
}

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

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [documents, setDocuments] = useState<string[]>([]);
	const [uploadStatus, setUploadStatus] = useState<string>("");

	const [chatInput, setChatInput] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [conversationId, setConversationId] = useState<string | null>(null);

	const [activeTab, setActiveTab] = useState<ActiveTab>("manage");

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
			const response = await axios.get<{ documents: string[] }>(
				`${API_URL}/rag/documents`
			);
			setDocuments(response.data.documents || []);
		} catch (error) {
			console.error("Lỗi khi tải danh sách tài liệu:", error);
		}
	};
	const fetchWatcherStatus = async () => {
		try {
			const response = await axios.get<{ watchers: WatcherStatus }>(
				`${API_URL}/watcher/status`
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

			await axios.post(`${API_URL}/watcher/toggle`, {
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
			const response = await axios.post(
				`${API_URL}/rag/upload`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

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
			await axios.delete(`${API_URL}/rag/document`, {
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
			const response = await axios.post(`${API_URL}/rag/chat`, payload);

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
		<div className="container">
			<h1>🤖 Document Assistant</h1>

			<div className="tabs">
				<button
					className={`tab-btn ${
						activeTab === "manage" ? "active" : ""
					}`}
					onClick={() => setActiveTab("manage")}
				>
					<span>📁 Quản lý Tệp</span>
				</button>
				<button
					className={`tab-btn ${
						activeTab === "chat" ? "active" : ""
					}`}
					onClick={() => setActiveTab("chat")}
				>
					<span>💬 Thử Chat</span>
				</button>
			</div>

			{/* --- TAB --- */}
			<div className="tab-content">
				{/* --- TAB 1: QUẢN LÝ TỆP --- */}
				{activeTab === "manage" && (
					<div className="section">
						<h2>Quản lý Tài liệu</h2>

						{/* Upload Form */}
						<form onSubmit={handleUpload} className="form-group">
							<label htmlFor="file-upload">
								Tải lên tài liệu (PDF, DOCX, MD)
							</label>
							<input
								id="file-upload"
								type="file"
								onChange={handleFileChange}
								accept=".pdf,.docx,.md,.txt"
							/>
							<button type="submit" disabled={!file}>
								📤 Tải lên
							</button>
							{uploadStatus && (
								<p className="status-text">{uploadStatus}</p>
							)}
						</form>

						{/* Danh sách Document */}
						<div className="doc-list">
							<h3>Tài liệu đã tải lên</h3>
							{documents.length === 0 ? (
								<div className="empty-state">
									<p>Chưa có tài liệu nào được tải lên.</p>
									<p>
										Hãy tải lên tài liệu đầu tiên của bạn!
									</p>
								</div>
							) : (
								<ul>
									{documents.map((doc) => (
										<li key={doc}>
											<span>{doc}</span>
											<button
												onClick={() =>
													handleDelete(doc)
												}
												className="delete-btn"
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
				{/* --- KIỂM SOÁT WATCHER --- */}
				<div className="watcher-controls section">
					<h3>Kiểm soát Watcher Tự động</h3>
					{watcherError && (
						<p className="status-text error">{watcherError}</p>
					)}
					{!watcherStatus ? (
						<p>Đang tải trạng thái...</p>
					) : (
						<div className="watcher-status-list">
							{/* Local Watcher */}
							<div className="watcher-item">
								<span>📁 Watcher Thư mục (Local)</span>
								<span
									className={`status-badge ${
										watcherStatus.local
											? "enabled"
											: "disabled"
									}`}
								>
									{watcherStatus.local
										? "Đang Bật"
										: "Đang Tắt"}
								</span>
								<div className="watcher-buttons">
									<button
										onClick={() =>
											handleToggleWatcher("local", true)
										}
										disabled={watcherStatus.local}
										className="toggle-btn"
									>
										Bật
									</button>
									<button
										onClick={() =>
											handleToggleWatcher("local", false)
										}
										disabled={!watcherStatus.local}
										className="toggle-btn"
									>
										Tắt
									</button>
								</div>
							</div>

							{/* RSS Watcher */}
							<div className="watcher-item">
								<span>📡 Watcher Tin tức (RSS)</span>
								<span
									className={`status-badge ${
										watcherStatus.rss
											? "enabled"
											: "disabled"
									}`}
								>
									{watcherStatus.rss
										? "Đang Bật"
										: "Đang Tắt"}
								</span>
								<div className="watcher-buttons">
									<button
										onClick={() =>
											handleToggleWatcher("rss", true)
										}
										disabled={watcherStatus.rss}
										className="toggle-btn"
									>
										Bật
									</button>
									<button
										onClick={() =>
											handleToggleWatcher("rss", false)
										}
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

				{/* --- TAB 2: CHATBOT --- */}
				{activeTab === "chat" && (
					<div className="section">
						<div className="chat-header">
							<h2>Chat với Tài liệu</h2>
							<button
								onClick={startNewChat}
								className="new-chat-btn"
							>
								✨ Bắt đầu Chat mới
							</button>
						</div>

						<div className="chat-window">
							{/* Các tin nhắn */}
							<div className="chat-messages">
								{messages.map((msg, index) => (
									<div
										key={index}
										className={`message ${msg.sender}`}
									>
										<p>{msg.text}</p>
										{msg.sender === "bot" &&
											msg.tokens !== undefined && (
												<span className="token-count">
													{msg.tokens} tokens
												</span>
											)}
									</div>
								))}
								{isLoading && (
									<div className="message bot">
										<p>
											Bot đang nhập
											<span className="loading-dots"></span>
										</p>
									</div>
								)}
							</div>

							{/* Chat Input Form */}
							<form
								onSubmit={handleChatSubmit}
								className="chat-input-form"
							>
								<input
									className="text-black"
									type="text"
									value={chatInput}
									onChange={(e) =>
										setChatInput(e.target.value)
									}
									placeholder="Hỏi bot về tài liệu của bạn..."
									disabled={isLoading}
								/>
								<button type="submit" disabled={isLoading}>
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

export default App;
