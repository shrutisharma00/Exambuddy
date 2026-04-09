import './ChatMessage.css'

function ChatMessage({ message, isQuiz = false }) {
  const { role, content, options, correctAnswer, explanation } = message

  if (isQuiz && role === 'assistant' && options) {
    return (
      <div className="message assistant quiz-question">
        <div className="message-content quiz-content">
          <p className="quiz-question-text">{content}</p>
          <div className="quiz-options">
            {options.map((option, index) => (
              <button key={index} className="quiz-option">
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isQuiz && role === 'assistant' && correctAnswer) {
    return (
      <div className="message assistant quiz-answer">
        <div className="message-content quiz-content">
          <p className="correct-answer">Correct Answer: {correctAnswer}</p>
          <div className="explanation">
            <strong>Explanation:</strong>
            <p>{explanation}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`message ${role}`}>
      <div className="message-content">
        <p>{content}</p>
      </div>
    </div>
  )
}

export default ChatMessage
