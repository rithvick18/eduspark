# ⚡ EduSpark

EduSpark is a cutting-edge, AI-powered educational platform designed specifically for Class 10 students in India. By leveraging advanced Large Language Models (LLMs), EduSpark provides personalized study materials, interactive practice sessions, and integrated learning resources for students across CBSE, ICSE, and various State Boards.

![EduSpark Banner](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Supabase-blue)

## 🚀 Key Features

- **🧠 AI-Generated Content**: Instant access to summaries, key points, and important formulas for any chapter or topic.
- **📝 Dynamic Practice Papers**: Generate custom practice tests (MCQs, short, and long answers) with varying difficulty levels (Easy, Medium, Hard).
- **💬 Ask AI Tutor**: A dedicated AI tutor to help clarify doubts in simple, student-friendly language.
- **🎥 Integrated Video Learning**: Automatically curated YouTube videos for every topic to enhance visual learning.
- **📊 Syllabus Mapping**: Clear visualization of the learning path for every subject and chapter.
- **📱 Interactive Practice Mode**: Real-time quizzes with instant feedback to track progress.
- **🌐 Multi-Board Support**: Tailored content for CBSE, ICSE, and major State Boards.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS with [Framer Motion](https://www.framer.com/motion/) for premium animations
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database/Auth**: [Supabase](https://supabase.com/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Engines**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/) & [Mistral AI](https://mistral.ai/)
- **Integrations**: [YouTube Search](https://pypi.org/project/youtube-search-python/), BeautifulSoup4 (for educational scraping)
- **Validation**: [Pydantic](https://docs.pydantic.dev/)

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- API Keys for Google Gemini or Mistral AI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_key
   MISTRAL_API_KEY=your_mistral_key
   AI_PROVIDER=gemini  # or mistral
   ALLOWED_ORIGINS=http://localhost:5173
   ```
5. Run the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. From the root directory:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📸 Project Structure
```text
├── backend/            # FastAPI Python server
│   ├── main.py         # Main application logic & AI endpoints
│   └── requirements.txt
├── src/                # React Frontend
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application views (Home, Practice, Courses, etc.)
│   ├── services/       # API integration services
│   └── styles.css      # Core design system
├── public/             # Static assets
└── package.json
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
