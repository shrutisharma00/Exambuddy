import { useState, useEffect, useRef } from 'react'
import './Home.css'

const API_URL = 'http://localhost:8000'
const SUBJECTS = ['Math', 'Science', 'English', 'GK','Social Science']

function Home() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('Math')
  const [quizMode, setQuizMode] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory')
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Namaste! 👋 Main Exam Buddy hoon. Pehle subject select karo, phir apna doubt poocho ya Quiz Mode ON karo! 😊'
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
    setSelectedAnswers({})
    setShowResults(false)

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      if (quizMode) {
        const response = await fetch(`${API_URL}/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: selectedSubject, topic: userMessage })
        })

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const data = await response.json()
        const questions = data.quiz.questions

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Quiz generated! 📝 Answer all questions and click Submit to see results.',
          questions: questions
        }])
      } else {
        const response = await fetch(`${API_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userMessage, subject: selectedSubject })
        })

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error aa gaya 😔: ${error.message}`
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

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const optionLetter = String.fromCharCode(65 + optionIndex)
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionLetter
    }))
  }

  const submitQuiz = () => {
    setShowResults(true)
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: quizMode 
        ? 'Quiz Mode ON! 📝 Topic select karo aur MCQ solve karo!'
        : 'Chat cleared! 🎉 Ab apna doubt poocho!'
    }])
    setSelectedAnswers({})
    setShowResults(false)
    localStorage.removeItem('chatHistory')
  }

  const getScore = (questions) => {
    let correct = 0
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correct++
      }
    })
    return correct
  }

  return (
    <div className="home-page">
      <div className="chat-wrapper">
        <div className="controls-bar">
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

          <div className="quiz-toggle">
            <span className={quizMode ? 'active' : ''}>📝 Quiz</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={quizMode}
                onChange={(e) => setQuizMode(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <button className="clear-btn" onClick={clearChat} title="Clear Chat">
            🗑️ Clear
          </button>

          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.questions ? (
                    <div className="quiz-container">
                      <p className="quiz-intro">{msg.content}</p>
                      {msg.questions.map((q, qIndex) => (
                        <div key={qIndex} className="quiz-question-block">
                          <p className="question-text">
                            <strong>Q{qIndex + 1}.</strong> {q.question}
                          </p>
                          <div className="quiz-options">
                            {q.options.map((option, oIndex) => {
                              const optionLetter = String.fromCharCode(65 + oIndex)
                              const isSelected = selectedAnswers[qIndex] === optionLetter
                              const isCorrect = q.answer === optionLetter
                              const showCorrect = showResults && isCorrect
                              const showWrong = showResults && isSelected && !isCorrect

                              return (
                                <button
                                  key={oIndex}
                                  className={`quiz-option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                                  onClick={() => !showResults && handleAnswerSelect(qIndex, oIndex)}
                                  disabled={showResults}
                                >
                                  <span className="option-letter">{optionLetter}</span>
                                  <span className="option-text">{option}</span>
                                </button>
                              )
                            })}
                          </div>
                          {showResults && (
                            <div className={`explanation-box ${showResults ? 'show' : ''}`}>
                              <p className="explanation-text">
                                <strong>Explanation:</strong> {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                      {!showResults && Object.keys(selectedAnswers).length > 0 && (
                        <button className="submit-quiz-btn" onClick={submitQuiz}>
                          Submit Quiz
                        </button>
                      )}
                      {showResults && (
                        <div className="quiz-score">
                          <h3>Your Score: {getScore(msg.questions)} / {msg.questions.length}</h3>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <textarea
              className="input-field"
              placeholder={quizMode ? "Type topic for quiz..." : "Apna doubt type karo..."}
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
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
