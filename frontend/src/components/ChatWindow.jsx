import { useState, useEffect, useRef } from 'react'
import './ChatWindow.css'

const API_URL = 'http://localhost:8000'
const SUBJECTS = ['Math', 'Science', 'English', 'GK', 'Social Science']

function ChatWindow({ onQuizStart, darkMode }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('Math')
  const [explainMode, setExplainMode] = useState('normal') // 'simple' or 'detailed'
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory')
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Namaste! 👋 Main Exam Buddy hoon, aapka personal AI study partner!\n\nMaine aapki help ke liye:\n• Chat mode mein koi bhi doubt poocho\n• Quiz mode mein apna knowledge test karo\n\nShuru karte hain! 🚀'
      }])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage = inputText.trim()
    setInputText('')

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    let explainPrompt = ''
    if (explainMode === 'simple') {
      explainPrompt = '\n\nExplain this in SIMPLE words like you would to a 10 year old child. Use very easy Hindi-English mix.'
    } else if (explainMode === 'detailed') {
      explainPrompt = '\n\nGive a DETAILED explanation with examples, step-by-step breakdown, and important points to remember.'
    }

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userMessage + explainPrompt,
          subject: selectedSubject
        })
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry yaar, kuch problem ho gayi 😔\n\nError: ${error.message}\n\nPlease try again!`
      }])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! 🎉\n\nAb naya sawaal poocho!'
    }])
    localStorage.removeItem('chatHistory')
  }

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="heading-text">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('•') || line.startsWith('-')) {
        return <p key={i} className="bullet-text">{line}</p>
      }
      if (line.match(/^Step \d+/i)) {
        return <p key={i} className="step-text">{line}</p>
      }
      return <p key={i}>{line}</p>
    })
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-subject">
          <span className="subject-label">Subject:</span>
          <select
            className="subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isLoading}
          >
            {SUBJECTS.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="chat-controls">
          <div className="explain-toggle">
            <button
              className={`toggle-btn ${explainMode === 'simple' ? 'active' : ''}`}
              onClick={() => setExplainMode(explainMode === 'simple' ? 'normal' : 'simple')}
              title="Explain Like I'm 10"
            >
              🧒 Simple
            </button>
            <button
              className={`toggle-btn ${explainMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setExplainMode(explainMode === 'detailed' ? 'normal' : 'detailed')}
              title="Detailed Explanation"
            >
              📚 Detailed
            </button>
          </div>

          <button className="quiz-start-btn" onClick={onQuizStart}>
            📝 Start Quiz
          </button>

          <button className="clear-btn" onClick={clearChat} title="Clear Chat">
            🗑️
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              {formatContent(msg.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Type your doubt here... (Hindi ya English mein)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
