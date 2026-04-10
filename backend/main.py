"""
Exam Buddy Backend - FastAPI server for doubt-solving chat app
Complete version with Auth + Quiz Mode
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import AsyncGroq
from dotenv import load_dotenv
import os
import json
from typing import List, Optional

load_dotenv()

app = FastAPI(title="Exam Buddy API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

client = AsyncGroq(api_key=GROQ_API_KEY)
GROQ_MODEL = "llama-3.1-8b-instant"

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

SYSTEM_PROMPT = """You are Exam Buddy, a friendly teacher for Indian students.

Simple Hinglish mein jawab do:
- Short aur clear explanation
- Step-by-step answer
- Easy examples
- Thoda motivation bhi 😊
"""

SUBJECT_PROMPTS = {
   "Math": """You are a Math teacher for Indian students.

Instructions:
- Har problem ko step-by-step solve karo
- Har step new line me likho:
  Step 1:
  Step 2:
  Step 3:
- Final answer alag line me likho:
  Final Answer:
- Formula use ho to clearly likho
- Short trick ho to end me add karo

Simple Hinglish use karo. Confident tone rakho 😊""",

    "Science": """You are a Science teacher for Indian students.

Instructions:
- Answer "Kyunki..." se start karo
- Concept ko simple language me explain karo
- Har point new line me likho:
  Step 1:
  Step 2:
  Step 3:
- Daily life example zaroor do
- End me short summary likho:
  Summary:

Simple Hinglish use karo 🔬""",

   "English": """You are an English teacher for Indian students.

Instructions:
- Rule explain karo step-by-step:
  Step 1:
  Step 2:
- Correct sentence alag line me likho:
  Correct Sentence:
- 2-3 examples do
- Common mistake bhi batado

Simple Hinglish use karo 📖""",

    "GK": """You are a General Knowledge teacher for Indian students (SSC, TET, State Exams, CBSE).

Tumhara style:
- Facts interesting tarike se present karo
- India aur duniya ki important events batana
- Current affairs ko connect karo jab relevant ho
- "Did you know?" se interesting facts shuru karo
- Dates aur events ko story-telling style mein samjhao

Simple Hinglish mein jawab do aur knowledge expand karo!""","Social Science": """You are a Social Science teacher.

Instructions:
- Topic ko story style me explain karo
- Har part new line me likho:
  Step 1:
  Step 2:
  Step 3:
- Important dates/events highlight karo
- Real-life ya India example zaroor do
- End me short summary likho:
  Summary:

Simple Hinglish use karo 📜"""
}

QUIZ_PROMPT = """You are a quiz generator for Indian students.

Generate EXACTLY 10 MCQ questions based on the topic.

Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "question": "Question text",
      "options": ["A option", "B option", "C option", "D option"],
      "answer": "A",
      "explanation": "Short Hinglish explanation"
    }
  ]
}

Rules:
- Total 10 questions (strict)
- Each question must have 4 options
- Only ONE correct answer (A/B/C/D)
- Mix difficulty (easy + medium)
- Questions should be from topic
- Explanation short & clear
- NO extra text, ONLY JSON"""

def get_system_prompt(subject: str) -> str:
    return SUBJECT_PROMPTS.get(subject, SYSTEM_PROMPT)

# Models
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChatMessage(BaseModel):
    role: str
    content: str

class QuestionRequest(BaseModel):
    text: str
    subject: str = "General"
    history: Optional[List[ChatMessage]] = None

class QuizRequest(BaseModel):
    subject: str = "General"
    topic: str

# Routes
@app.get("/")
async def root():
    return {"message": "Exam Buddy API running", "version": "3.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/signup")
async def signup(user: UserSignup):
    users = load_users()
    
    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": user.password
    }
    save_users(users)
    
    return {
        "message": "Signup successful",
        "user": {
            "name": user.name,
            "email": user.email
        }
    }

@app.post("/login")
async def login(user: UserLogin):
    users = load_users()
    
    if user.email not in users:
        raise HTTPException(status_code=400, detail="Email not found")
    
    if users[user.email]["password"] != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    return {
        "message": "Login successful",
        "user": {
            "name": users[user.email]["name"],
            "email": users[user.email]["email"]
        }
    }

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    system_prompt = get_system_prompt(request.subject)
    messages = [{"role": "system", "content": system_prompt}]

    if request.history:
        for msg in request.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": request.text})

    try:
        response = await client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=800,
            top_p=0.9,
        )

        answer = response.choices[0].message.content
        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/quiz")
async def generate_quiz(request: QuizRequest):
    if not request.topic or not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    system_prompt = get_system_prompt(request.subject) + "\n\n" + QUIZ_PROMPT
    messages = [{"role": "system", "content": system_prompt}]
    messages.append({"role": "user", "content": f"Generate 10 MCQs on topic: {request.topic} for {request.subject}"})

    try:
        response = await client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.8,
            max_tokens=4000,
        )

        result_text = response.choices[0].message.content
        
        result_text = result_text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        result_text = result_text.strip()
        
        quiz_data = json.loads(result_text)
        
        return {
            "quiz": {
                "questions": quiz_data.get("questions", [])
            }
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse quiz: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
