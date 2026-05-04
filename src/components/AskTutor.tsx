import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { contentAPI, type ContentRequest } from "../services/api";

interface AskTutorProps {
  board: string;
  subject: string;
  chapter: string;
  topic?: string;
}

export function AskTutor({ board, subject, chapter, topic }: AskTutorProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const context: ContentRequest = { board, subject, chapter, topic };
      const res = await contentAPI.askQuestion(question, context);
      setAnswer(res.answer);
    } catch {
      setAnswer("Sorry, I could not answer that. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="ask-tutor-panel">
      <div className="ask-tutor-heading">
        <span>
          <Bot size={18} />
        </span>
        <div>
          <p className="section-kicker">AI Tutor</p>
          <h3>Ask Your Doubt</h3>
        </div>
      </div>
      <form onSubmit={handleAsk} className="ask-tutor-form">
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. What is the formula for photosynthesis?"
        />
        <button type="submit" className="pill-button small" disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
          <Send size={14} />
        </button>
      </form>
      {answer && (
        <div className="ask-tutor-answer">
          <small>Answer</small>
          <p>{answer}</p>
        </div>
      )}
    </article>
  );
}
