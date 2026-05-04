from __future__ import annotations

import json
import os
from typing import Any, Dict, Literal, Optional

import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mistralai import Mistral
from pydantic import BaseModel, Field

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-large-latest")
AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000").split(",")
    if origin.strip()
]

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

gemini_model = genai.GenerativeModel(GEMINI_MODEL) if GEMINI_API_KEY else None
mistral_client = Mistral(api_key=MISTRAL_API_KEY) if MISTRAL_API_KEY else None

app = FastAPI(title="EduSpark Content API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContentRequest(BaseModel):
    board: str = Field(..., examples=["CBSE"])
    subject: str = Field(..., examples=["Science"])
    chapter: str = Field(..., examples=["Life Processes"])
    topic: Optional[str] = Field(default=None, examples=["Photosynthesis"])


class QuestionRequest(BaseModel):
    board: str
    subject: str
    chapter: str
    difficulty: Literal["easy", "medium", "hard"] = "medium"


class AskRequest(BaseModel):
    question: str
    context: ContentRequest


class SyllabusMapRequest(BaseModel):
    board: str
    subject: str
    chapter: Optional[str] = None
    topic: Optional[str] = None


def clean_json_response(text: str) -> str:
    cleaned = text.replace("```json", "").replace("```", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        return cleaned[start : end + 1]
    return cleaned


def parse_json_response(text: str) -> Dict[str, Any]:
    return json.loads(clean_json_response(text))


def mock_content(req: ContentRequest) -> Dict[str, Any]:
    topic = req.topic or "Full chapter overview"
    return {
        "summary": (
            f"{req.board} {req.subject} chapter '{req.chapter}' focuses on {topic}. "
            "Start with the core definitions, connect them to textbook examples, and finish with short practice questions."
        ),
        "key_points": [
            "Read the NCERT-style explanation before memorising terms.",
            "Write definitions in your own words and connect each idea to one example.",
            "Practice one MCQ, one short answer, and one long answer after revision.",
        ],
        "important_formulas": [],
        "ncert_reference": "Use the matching Class 10 NCERT chapter section for exact page references.",
        "suggested_videos": [
            {
                "title": f"{req.board} Class 10 {req.subject}: {req.chapter}",
                "search_query": f"{req.board} class 10 {req.subject} {req.chapter} {topic} explained",
            }
        ],
        "practice_questions": [
            {
                "question": f"Explain the main idea of {topic} in {req.chapter}.",
                "answer": "Define the concept, add one textbook example, and mention why it matters.",
                "type": "short",
            }
        ],
    }


def mock_paper(req: QuestionRequest) -> Dict[str, Any]:
    return {
        "mcqs": [
            {
                "q": f"Which option best describes a key idea from {req.chapter}?",
                "options": ["Definition", "Example", "Formula", "All of these"],
                "correct": "D",
            }
        ],
        "short": [
            {
                "q": f"Write two important points from {req.subject} chapter {req.chapter}.",
                "answer": "Mention the core definition and support it with a relevant example.",
            }
        ],
        "long": [
            {
                "q": f"Explain {req.chapter} with examples and a labelled structure where useful.",
                "answer": "Start with the concept, expand into steps, include examples, and end with exam keywords.",
            }
        ],
    }


def call_gemini_json(prompt: str) -> Dict[str, Any]:
    if gemini_model is None:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    response = gemini_model.generate_content(prompt)
    return parse_json_response(response.text)


def call_mistral_json(prompt: str) -> Dict[str, Any]:
    if mistral_client is None:
        raise RuntimeError("MISTRAL_API_KEY is not configured")
    response = mistral_client.chat.complete(
        model=MISTRAL_MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    return parse_json_response(response.choices[0].message.content)


def get_ai_response(prompt: str, use_provider: str | None = None) -> str:
    """Get response from configured AI provider (Gemini or Mistral)."""
    provider = use_provider or AI_PROVIDER
    
    if provider == "mistral" and mistral_client:
        response = mistral_client.chat.complete(
            model=MISTRAL_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content
    elif provider == "gemini" and gemini_model:
        response = gemini_model.generate_content(prompt)
        return response.text
    else:
        raise RuntimeError(f"AI provider '{provider}' is not configured")


def get_ai_json_response(prompt: str, use_provider: str | None = None) -> Dict[str, Any]:
    """Get JSON response from configured AI provider (Gemini or Mistral)."""
    provider = use_provider or AI_PROVIDER
    
    if provider == "mistral" and mistral_client:
        return call_mistral_json(prompt)
    elif provider == "gemini" and gemini_model:
        return call_gemini_json(prompt)
    else:
        raise RuntimeError(f"AI provider '{provider}' is not configured")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "integrations": {
            "gemini": bool(GEMINI_API_KEY),
            "mistral": bool(MISTRAL_API_KEY),
            "youtube": True,
            "web_scrape": True,
        },
        "active_provider": AI_PROVIDER,
        "gemini_model": GEMINI_MODEL if GEMINI_API_KEY else None,
        "mistral_model": MISTRAL_MODEL if MISTRAL_API_KEY else None,
    }


@app.get("/api/boards")
async def get_boards():
    return {
        "boards": [
            {
                "name": "CBSE",
                "classes": ["10"],
                "subjects": ["Science", "Maths", "Social Science", "English"],
            },
            {
                "name": "ICSE",
                "classes": ["10"],
                "subjects": ["Science", "Mathematics", "History & Civics", "English"],
            },
            {
                "name": "State",
                "classes": ["10"],
                "subjects": ["Science", "Maths", "Social Science"],
            },
        ]
    }


@app.post("/api/content")
async def get_content(req: ContentRequest):
    try:
        prompt = f"""
        You are an educational content curator for Indian Class 10 {req.board} board students.
        Find and summarize content for:
        - Subject: {req.subject}
        - Chapter: {req.chapter}
        - Topic: {req.topic or 'Full chapter overview'}

        Return ONLY a JSON object with this structure:
        {{
            "summary": "Brief explanation in simple English/Hinglish",
            "key_points": ["point 1", "point 2"],
            "important_formulas": ["formula 1"],
            "ncert_reference": "Relevant NCERT page/section if known",
            "suggested_videos": [
                {{"title": "...", "search_query": "..."}}
            ],
            "practice_questions": [
                {{"question": "...", "answer": "...", "type": "mcq/short/long"}}
            ]
        }}
        """

        try:
            parsed = get_ai_json_response(prompt)
            source = AI_PROVIDER
        except RuntimeError:
            parsed = mock_content(req)
            source = "mock"
        
        videos = await fetch_youtube_videos(req.board, req.subject, req.chapter, req.topic)
        parsed["youtube_videos"] = videos

        return {
            "success": True,
            "data": parsed,
            "board": req.board,
            "subject": req.subject,
            "source": source,
        }
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"AI returned invalid JSON: {exc}") from exc
    except Exception as exc:
        fallback = mock_content(req)
        fallback["youtube_videos"] = []
        return {
            "success": True,
            "data": fallback,
            "board": req.board,
            "subject": req.subject,
            "source": "fallback",
            "warning": str(exc),
        }


@app.post("/api/ask")
async def ask_question(req: AskRequest):
    try:
        if not gemini_model and not mistral_client:
            return {
                "answer": (
                    f"Here is a study-friendly way to think about it: {req.question.strip()} "
                    f"belongs to {req.context.subject} - {req.context.chapter}. Start with the definition, "
                    "add one textbook example, and write the final answer in short steps."
                ),
                "source": "mock",
            }

        prompt = f"""
        You are a Class 10 {req.context.board} board tutor. A student asks:
        "{req.question}"

        Context: {req.context.subject} - {req.context.chapter}
        Topic: {req.context.topic or 'Not specified'}

        Answer in simple, encouraging language. Use examples if helpful.
        If it is a math/science problem, solve step-by-step.
        """

        answer = get_ai_response(prompt)
        return {"answer": answer, "source": AI_PROVIDER}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/generate-paper")
async def generate_paper(req: QuestionRequest):
    try:
        prompt = f"""
        Generate a {req.difficulty} difficulty practice paper for:
        {req.board} Class 10 - {req.subject} - {req.chapter}

        Include:
        - 5 MCQs (1 mark each)
        - 3 Short answer (2 marks each)
        - 2 Long answer (5 marks each)

        Return ONLY JSON:
        {{
            "mcqs": [{{"q": "...", "options": ["A","B","C","D"], "correct": "A"}}],
            "short": [{{"q": "...", "answer": "..."}}],
            "long": [{{"q": "...", "answer": "..."}}]
        }}
        """

        try:
            return get_ai_json_response(prompt)
        except RuntimeError:
            return mock_paper(req)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"AI returned invalid JSON: {exc}") from exc
    except Exception:
        return mock_paper(req)


@app.post("/api/syllabus/map")
async def map_syllabus(req: SyllabusMapRequest):
    chapter = req.chapter or "Current chapter"
    topic = req.topic or "Full chapter"
    return {
        "board": req.board,
        "subject": req.subject,
        "units": [
            {
                "title": chapter,
                "topics": [topic, "Key definitions", "Textbook examples", "Practice questions"],
            }
        ],
        "recommended_path": ["Read summary", "Watch explanation", "Solve MCQs", "Write one long answer"],
    }


@app.post("/api/practice/generate")
async def generate_practice(req: QuestionRequest):
    paper = await generate_paper(req)
    questions = []
    for item in paper.get("mcqs", [])[:5]:
        options = item.get("options") or ["A", "B", "C", "D"]
        correct = str(item.get("correct", "A")).strip().upper()
        correct_index = max(0, min(3, ord(correct[0]) - ord("A"))) if correct else 0
        questions.append(
            {
                "topic": req.chapter,
                "prompt": item.get("q", "Choose the correct answer."),
                "options": options,
                "correctIndex": correct_index,
                "hint": "Review the chapter summary and eliminate unlikely options.",
            }
        )
    return {"questions": questions}


async def fetch_youtube_videos(board: str, subject: str, chapter: str, topic: Optional[str]):
    try:
        from youtubesearchpython import VideosSearch

        query = f"{board} class 10 {subject} {chapter} {topic or ''} explained".strip()
        search = VideosSearch(query, limit=5)
        results = search.result().get("result", [])

        return [
            {
                "title": video.get("title"),
                "link": video.get("link"),
                "duration": video.get("duration"),
                "channel": (video.get("channel") or {}).get("name"),
                "thumbnail": video.get("thumbnails", [{}])[0].get("url") if video.get("thumbnails") else None,
            }
            for video in results
        ]
    except Exception:
        return []


@app.get("/api/ncert/{subject}/{chapter}")
async def get_ncert_text(subject: str, chapter: str):
    base_url = f"https://ncert.nic.in/textbook/pdf/{subject.lower()}{chapter}.pdf"
    return {
        "note": "NCERT scraping requires a specific URL mapping per book. DIKSHA API is better for structured content.",
        "candidate_url": base_url,
    }


@app.get("/api/scrape")
async def scrape_page(url: str):
    allowed_hosts = ("ncert.nic.in", "diksha.gov.in")
    if not any(host in url for host in allowed_hosts):
        raise HTTPException(status_code=400, detail="Only configured education sources can be scraped")

    try:
        response = requests.get(url, timeout=8)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else url
        text = " ".join(soup.get_text(" ").split())[:1200]
        return {"title": title, "text": text, "url": url}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
