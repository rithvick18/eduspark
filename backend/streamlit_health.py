import os
import time
from datetime import datetime
import requests
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
REFRESH_INTERVAL = int(os.getenv("REFRESH_INTERVAL", "10"))

st.set_page_config(
    page_title="EduSpark Health Monitor",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded",
)

def fetch_health():
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e), "status": "unreachable"}

def check_api_endpoint(method: str, endpoint: str, payload: dict = None):
    url = f"{BACKEND_URL}{endpoint}"
    start = time.time()
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        else:
            response = requests.post(url, json=payload, timeout=15)
        response.raise_for_status()
        return {
            "status": "✅ OK",
            "response_time": f"{(time.time() - start) * 1000:.0f}ms",
            "status_code": response.status_code,
        }
    except requests.RequestException as e:
        return {
            "status": "❌ Error",
            "response_time": f"{(time.time() - start) * 1000:.0f}ms",
            "error": str(e)[:100],
        }

st.title("🏥 EduSpark Backend Health Monitor")
st.caption(f"Monitoring: `{BACKEND_URL}` | Auto-refresh: {REFRESH_INTERVAL}s")

if st.button("🔄 Manual Refresh"):
    st.rerun()

col1, col2, col3, col4 = st.columns(4)

health_data = fetch_health()

if "error" in health_data:
    st.error(f"🔴 Backend Unreachable: {health_data['error']}")
else:
    with col1:
        st.metric("Status", "🟢 Healthy" if health_data.get("status") == "ok" else "🔴 Unhealthy")
    
    with col2:
        provider = health_data.get("active_provider", "unknown")
        st.metric("AI Provider", provider.upper())
    
    with col3:
        gemini_ok = health_data.get("integrations", {}).get("gemini", False)
        mistral_ok = health_data.get("integrations", {}).get("mistral", False)
        active_ai = "✅" if (gemini_ok or mistral_ok) else "❌"
        st.metric("AI Available", active_ai)
    
    with col4:
        st.metric("Last Check", datetime.now().strftime("%H:%M:%S"))

st.divider()

st.subheader("🔌 Integration Status")

if "integrations" in health_data:
    integ = health_data["integrations"]
    cols = st.columns(4)
    
    integrations = [
        ("Gemini", integ.get("gemini", False)),
        ("Mistral", integ.get("mistral", False)),
        ("YouTube", integ.get("youtube", False)),
        ("Web Scrape", integ.get("web_scrape", False)),
    ]
    
    for col, (name, status) in zip(cols, integrations):
        with col:
            icon = "🟢" if status else "🔴"
            st.metric(name, f"{icon} {'ON' if status else 'OFF'}")

st.divider()

st.subheader("🤖 AI Configuration")

if "gemini_model" in health_data or "mistral_model" in health_data:
    gemini_model = health_data.get("gemini_model") or "Not configured"
    mistral_model = health_data.get("mistral_model") or "Not configured"
    
    col1, col2 = st.columns(2)
    with col1:
        st.info(f"**Gemini Model:** `{gemini_model}`")
    with col2:
        st.info(f"**Mistral Model:** `{mistral_model}`")

st.divider()

st.subheader("🔍 Endpoint Health Checks")

endpoints = [
    ("Health", "GET", "/health", None),
    ("Boards", "GET", "/api/boards", None),
    ("Generate Content", "POST", "/api/content", {
        "board": "CBSE",
        "subject": "Science",
        "chapter": "Life Processes",
    }),
    ("Ask Question", "POST", "/api/ask", {
        "question": "What is photosynthesis?",
        "context": {
            "board": "CBSE",
            "subject": "Science",
            "chapter": "Life Processes",
            "topic": "Photosynthesis",
        },
    }),
]

results = []
for name, method, endpoint, payload in endpoints:
    result = check_api_endpoint(method, endpoint, payload)
    result["name"] = name
    result["endpoint"] = endpoint
    results.append(result)

for result in results:
    col1, col2, col3, col4 = st.columns([2, 2, 1, 1])
    
    with col1:
        st.write(f"**{result['name']}**")
        st.caption(f"`{result['endpoint']}`")
    
    with col2:
        st.write(result["status"])
        if "error" in result:
            st.caption(f"⚠️ {result['error']}")
    
    with col3:
        st.write(f"⏱️ {result.get('response_time', 'N/A')}")
    
    with col4:
        if "status_code" in result:
            st.write(f"HTTP {result['status_code']}")

st.divider()

st.subheader("📊 System Info")

sys_col1, sys_col2 = st.columns(2)

with sys_col1:
    st.write("**Backend URL:**")
    st.code(BACKEND_URL)

with sys_col2:
    st.write("**Dashboard Version:**")
    st.code("1.0.0")

time.sleep(REFRESH_INTERVAL)
st.rerun()
