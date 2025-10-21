// src/App.tsx
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react' // Sửa lỗi import
import axios from 'axios'
import './App.css'

// Định nghĩa kiểu dữ liệu
interface Document {
  name: string
}

interface Message {
  sender: 'user' | 'bot'
  text: string
  tokens?: number
}

// Kiểu (Type) cho state của tab
type ActiveTab = 'manage' | 'chat'

function App() {
  // Trạng thái cho RAG Management
  const [file, setFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<string[]>([])
  const [uploadStatus, setUploadStatus] = useState<string>('')

  // Trạng thái cho Chat
  const [chatInput, setChatInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // --- STATE MỚI ĐỂ QUẢN LÝ TAB ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('manage')

  // API Endpoints
  const API_URL = '/api'

  // 1. Tải danh sách documents khi component được mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await axios.get<{ documents: string[] }>(
        `${API_URL}/rag/documents`
      )
      setDocuments(response.data.documents || [])
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài liệu:', error)
    }
  }

  // 2. Xử lý Upload file (Giữ nguyên)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) {
      setUploadStatus('Vui lòng chọn một file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    setUploadStatus(`Đang tải lên ${file.name}...`)

    try {
      const response = await axios.post(
        `${API_URL}/rag/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setUploadStatus(`Tải lên thành công: ${response.data.filename}`)
      setFile(null)
      fetchDocuments()
    } catch (error) {
      console.error('Lỗi khi upload:', error)
      setUploadStatus('Tải lên thất bại.')
    }
  }

  // 3. Xử lý Xóa file (Giữ nguyên)
  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${filename} không?`)) {
      return
    }
    try {
      await axios.delete(`${API_URL}/rag/document`, {
        data: { filename: filename },
      })
      fetchDocuments()
    } catch (error) {
      console.error('Lỗi khi xóa file:', error)
    }
  }

  // 4. Xử lý Chat (Giữ nguyên)
  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage: Message = { sender: 'user', text: chatInput }
    setMessages((prev) => [...prev, userMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/rag/chat`, {
        query: chatInput,
      })

      const { answer, token_usage } = response.data
      const botMessage: Message = {
        sender: 'bot',
        text: answer,
        tokens: token_usage?.total_tokens || 0,
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Lỗi khi chat:', error)
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Đã xảy ra lỗi, không thể lấy câu trả lời.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Bảng điều khiển RAG</h1>

      {/* --- PHẦN ĐIỀU HƯỚNG TAB --- */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Quản lý Tệp
        </button>
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Thử Chat
        </button>
      </div>

      {/* --- NỘI DUNG TAB --- */}
      <div className="tab-content">
        {/* --- TAB 1: QUẢN LÝ TỆP --- */}
        {activeTab === 'manage' && (
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
                Tải lên
              </button>
              {uploadStatus && <p className="status-text">{uploadStatus}</p>}
            </form>

            {/* Danh sách Document */}
            <div className="doc-list">
              <h3>Tài liệu đã tải lên</h3>
              {documents.length === 0 ? (
                <p>Chưa có tài liệu nào.</p>
              ) : (
                <ul>
                  {documents.map((doc) => (
                    <li key={doc}>
                      <span>{doc}</span>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="delete-btn"
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: CHATBOT --- */}
        {activeTab === 'chat' && (
          <div className="section">
            <h2>Chat với Tài liệu</h2>
            <div className="chat-window">
              {/* Các tin nhắn */}
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <p>{msg.text}</p>
                    {msg.sender === 'bot' && msg.tokens !== undefined && (
                      <span className="token-count">{msg.tokens} tokens</span>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot">
                    <p>Bot đang nhập...</p>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleChatSubmit} className="chat-input-form">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Hỏi bot về tài liệu của bạn..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                  Gửi
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App