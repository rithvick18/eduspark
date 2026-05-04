# EduSpark Backend

FastAPI service for AI-curated Class 10 study content, tutor Q&A, and practice papers.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

`GEMINI_API_KEY` is optional for local development. If it is missing, the API returns deterministic fallback content so the frontend can keep working.

## Health Monitor Dashboard

A Streamlit dashboard is included to monitor the backend health status and API endpoints.

```bash
# In a separate terminal, with the backend running:
streamlit run streamlit_health.py
```

The dashboard will open at `http://localhost:8501` and displays:
- Overall backend health status
- AI integration status (Gemini/Mistral)
- API endpoint health checks with response times
- Auto-refresh every 10 seconds (configurable via `REFRESH_INTERVAL` env var)
