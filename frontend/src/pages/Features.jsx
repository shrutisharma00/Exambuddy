import { useState } from 'react'
import './Features.css'

const features = [
  { icon: '💬', title: 'AI Chat Assistant', description: 'Get instant answers with AI-powered chat in simple Hinglish' },
  { icon: '🧠', title: 'Smart Quiz System', description: 'Interactive MCQ quizzes with instant feedback and explanations' },
  { icon: '📚', title: 'Subject-wise Learning', description: 'Structured learning across Math, Science, English, GK & more' },
  { icon: '📊', title: 'Performance Tracking', description: 'Monitor your progress with detailed analytics and insights' },
  { icon: '🎯', title: 'Study Mode Toggle', description: 'Choose difficulty levels - Easy, Medium, or Hard' },
  { icon: '📈', title: 'Progress Analytics', description: 'Visual dashboards showing your growth over time' }
]

const subjects = [
  { name: 'Mathematics', icon: '🔢' },
  { name: 'Science', icon: '🔬' },
  { name: 'English', icon: '📖' },
  { name: 'General Knowledge', icon: '🌍' },
  { name: 'Social Science', icon: '🏛️' }
]

const mockScores = [
  { subject: 'Math', score: 85 },
  { subject: 'Science', score: 92 },
  { subject: 'English', score: 78 },
  { subject: 'GK', score: 88 },
  { subject: 'Social', score: 81 }
]

function Features() {
  const [quizActive, setQuizActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [elLevel, setElLevel] = useState('EL10')
  const [responseType, setResponseType] = useState('short')
  const [studyMode, setStudyMode] = useState('easy')

  const quizQuestions = [
    { question: 'What is the capital of India?', options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'], correct: 1 },
    { question: 'What is 15 + 27?', options: ['40', '42', '44', '46'], correct: 1 },
    { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2 },
    { question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1 },
    { question: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], correct: 1 },
    { question: 'Which is the largest ocean?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2 },
    { question: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correct: 2 },
    { question: 'Who invented the telephone?', options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Isaac Newton'], correct: 1 },
    { question: 'What is the speed of light?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10⁷ m/s', '3×10⁹ m/s'], correct: 1 },
    { question: 'Which country has the largest population?', options: ['USA', 'India', 'China', 'Indonesia'], correct: 1 }
  ]

  const handleAnswerSelect = (index) => setSelectedAnswer(index)

  const handleSubmitAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) setScore(score + 1)
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setQuizActive(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
  }

  const average = Math.round(mockScores.reduce((acc, s) => acc + s.score, 0) / mockScores.length)
  const bestSubject = mockScores.reduce((best, s) => s.score > best.score ? s : best, mockScores[0])

  return (
    <div className="features-page">
      <div className="features-header">
        <h1>Amazing Features</h1>
        <p>Everything you need for effective learning</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="content-section">
        <section className="ai-chat-section">
          <h2>AI Chat Assistant</h2>
          <p>Get instant answers to your doubts with our intelligent AI tutor</p>
          
          <div className="chat-controls">
            <div className="control-group">
              <label>EL Level:</label>
              <div className="button-group">
                {['EL5', 'EL10', 'EL15'].map((level) => (
                  <button
                    key={level}
                    className={elLevel === level ? 'active' : ''}
                    onClick={() => setElLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label>Response:</label>
              <div className="button-group">
                {['short', 'detailed'].map((type) => (
                  <button
                    key={type}
                    className={responseType === type ? 'active' : ''}
                    onClick={() => setResponseType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chat-preview">
            <div className="chat-message user">
              <span className="avatar">You</span>
              <p>Explain Newton's three laws of motion in simple terms</p>
            </div>
            <div className="chat-message ai">
              <span className="avatar">AI</span>
              <p>
                {elLevel === 'EL5' ? "1. Things keep moving unless stopped. 2. Force = mass × acceleration. 3. Every action has equal reaction." : 
                 elLevel === 'EL10' ? "Newton's 1st Law: Objects stay still or keep moving until pushed. 2nd: Force makes things accelerate - more mass needs more force. 3rd: When you push something, it pushes back equally." : 
                 "First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion unless acted by external force. Second Law: F = ma - Force equals mass times acceleration. Third Law: For every action, there is an equal and opposite reaction."}
              </p>
            </div>
          </div>
        </section>

        <section className="quiz-section">
          <h2>Smart Quiz System</h2>
          <p>Test your knowledge with interactive MCQ quizzes</p>
          
          {!quizActive && !showResult && (
            <div className="quiz-start">
              <span className="quiz-icon">📝</span>
              <h3>Ready to Quiz?</h3>
              <p>10 MCQs with instant feedback and explanations</p>
              <button className="quiz-btn" onClick={() => setQuizActive(true)}>Start Quiz</button>
            </div>
          )}

          {quizActive && !showResult && (
            <div className="quiz-active">
              <div className="quiz-progress">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="quiz-score">Score: {score}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`}}></div>
              </div>
              <h3 className="question-text">{quizQuestions[currentQuestion].question}</h3>
              <div className="options">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
              <button 
                className="quiz-btn" 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
              </button>
            </div>
          )}

          {showResult && (
            <div className="quiz-result">
              <span className="result-emoji">{score >= 7 ? '🎉' : score >= 4 ? '👍' : '💪'}</span>
              <h3>Quiz Complete!</h3>
              <p>Your Score: <strong>{score}</strong> / {quizQuestions.length}</p>
              <button className="quiz-btn" onClick={resetQuiz}>Try Again</button>
            </div>
          )}
        </section>

        <section className="subjects-section">
          <h2>Subject-wise Learning</h2>
          <p>Choose your subject and start learning</p>
          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-card">
                <span className="subject-icon">{subject.icon}</span>
                <h3>{subject.name}</h3>
                <p>Difficulty: Medium</p>
              </div>
            ))}
          </div>
        </section>

        <section className="performance-section">
          <h2>Performance Tracking</h2>
          <p>Monitor your progress and identify areas for improvement</p>
          
          <div className="stats-cards">
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <p className="stat-label">Average Score</p>
              <p className="stat-value">{average}%</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏆</span>
              <p className="stat-label">Best Subject</p>
              <p className="stat-value">{bestSubject.subject}</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📈</span>
              <p className="stat-label">Total Tests</p>
              <p className="stat-value">{mockScores.length}</p>
            </div>
          </div>

          <div className="scores-chart">
            <h3>Subject Scores</h3>
            {mockScores.map((item, index) => (
              <div key={index} className="score-row">
                <div className="score-info">
                  <span>{item.subject}</span>
                  <span>{item.score}%</span>
                </div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${item.score}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="study-mode-section">
          <h2>Study Mode Toggle</h2>
          <p>Choose your difficulty level and customize your learning experience</p>
          
          <div className="mode-options">
            {[
              { mode: 'easy', label: 'Easy', icon: '🌱', desc: 'Perfect for beginners' },
              { mode: 'medium', label: 'Medium', icon: '🌿', desc: 'Balanced challenge' },
              { mode: 'hard', label: 'Hard', icon: '🔥', desc: 'Advanced level' }
            ].map((item) => (
              <button
                key={item.mode}
                className={`mode-card ${studyMode === item.mode ? 'active' : ''}`}
                onClick={() => setStudyMode(item.mode)}
              >
                <span className="mode-icon">{item.icon}</span>
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="analytics-section">
          <h2>Progress Analytics</h2>
          <p>Visual dashboards showing your growth over time</p>
          
          <div className="analytics-cards">
            <div className="analytics-card blue">
              <p className="analytics-label">This Week</p>
              <p className="analytics-value">23 hours</p>
              <p className="analytics-sub">+15% vs last week</p>
            </div>
            <div className="analytics-card purple">
              <p className="analytics-label">Questions Solved</p>
              <p className="analytics-value">156</p>
              <p className="analytics-sub">+8% accuracy</p>
            </div>
            <div className="analytics-card green">
              <p className="analytics-label">Streak</p>
              <p className="analytics-value">7 days</p>
              <p className="analytics-sub">Keep it up!</p>
            </div>
          </div>

          <div className="chart">
            {[65, 80, 45, 90, 70, 85, 95].map((value, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-fill" style={{height: `${value}%`}}></div>
                <span>Day {index + 1}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="cta-section">
        <h2>Start Your Learning Journey Today</h2>
        <p>Join thousands of students who are already improving their grades with Exam Buddy</p>
        <div className="cta-buttons">
          <button className="cta-primary">Get Started Free</button>
          <button className="cta-secondary">Watch Demo</button>
        </div>
      </section>
    </div>
  )
}

export default Features