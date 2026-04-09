import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Exam Buddy</h1>
        <p className="tagline">Your Personal AI Study Partner</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>What is Exam Buddy?</h2>
          <p>
            Exam Buddy is an AI-powered study companion designed specifically for Indian students. 
            Whether you're preparing for CBSE exams, SSC, TET, NEET, or JEE, Exam Buddy is here to help 
            you understand concepts quickly and effectively.
          </p>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <h3>Select Subject</h3>
              <p>Choose from Math, Science, English, or GK</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <h3>Ask Questions</h3>
              <p>Type your doubt in simple Hindi or English</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <h3>Get Answers</h3>
              <p>Receive instant explanations in Hinglish</p>
            </div>
          </div>
        </section>

        <section className="about-section tech-stack">
          <h2>Built With</h2>
          <div className="tech-icons">
            <div className="tech-item">
              <span className="tech-icon">⚛️</span>
              <span>React</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">⚡</span>
              <span>FastAPI</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🤖</span>
              <span>Groq AI</span>
            </div>
          </div>
        </section>

        <section className="about-section cta">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students who are already using Exam Buddy</p>
          <Link to="/" className="cta-btn">Get Started</Link>
        </section>
      </div>
    </div>
  )
}

export default About
