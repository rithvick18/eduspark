import { useState, useRef, useEffect } from "react";
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { contentAPI } from "../services/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  "Explain photosynthesis simply",
  "Solve: 2x² + 5x - 3 = 0",
  "What caused World War I?",
  "Define Newton's 3rd Law",
  "Tips for exam preparation",
];

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your EduSpark AI tutor 🎓 Ask me anything about your subjects – Math, Science, History, and more. I'll explain in simple, student-friendly language!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && !minimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, minimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await contentAPI.askQuestion(text.trim(), {
        board: "CBSE",
        subject: "General",
        chapter: "General",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.answer,
          timestamp: new Date(),
        },
      ]);
    } catch {
      // Provide a helpful fallback response
      const fallbackResponses: Record<string, string> = {
        photosynthesis:
          "🌿 Photosynthesis is how plants make their own food! They use:\n• Sunlight (energy)\n• Carbon dioxide (from air)\n• Water (from soil)\n\nFormula: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nThe glucose gives plants energy, and they release oxygen for us to breathe!",
        solve:
          "Let me solve 2x² + 5x - 3 = 0 step by step:\n\nUsing the quadratic formula: x = (-b ± √(b²-4ac)) / 2a\n\na=2, b=5, c=-3\n\nDiscriminant = 25 + 24 = 49\n√49 = 7\n\nx = (-5 + 7)/4 = 1/2\nx = (-5 - 7)/4 = -3\n\n✅ Solutions: x = 0.5 or x = -3",
        war: "World War I (1914-1918) was caused by:\n\n1. 🤝 Alliance System – Europe divided into two groups\n2. 💪 Imperialism – Competition for colonies\n3. ⚔️ Militarism – Arms race between powers\n4. 🇦🇹 Assassination – Archduke Franz Ferdinand\n5. 🏛️ Nationalism – Ethnic tensions in Balkans\n\nRemember: M.A.I.N. = Militarism, Alliances, Imperialism, Nationalism",
        newton:
          "Newton's Third Law: 'For every action, there is an equal and opposite reaction.'\n\n📌 Examples:\n• When you push a wall, the wall pushes back on you\n• A rocket pushes gases down, gases push the rocket up\n• When you swim, you push water backward, water pushes you forward\n\n⚡ Key: Forces always come in pairs and act on different objects!",
        exam: "📝 Top Exam Preparation Tips:\n\n1. 📅 Make a timetable – allocate time per subject\n2. 📖 Read NCERT first – it's the exam foundation\n3. ✍️ Practice previous year papers\n4. 🧠 Use active recall – test yourself\n5. 😴 Get 7-8 hours sleep before exams\n6. 📝 Write important formulas daily\n7. 🏃 Take 10-min breaks every hour\n\nGood luck! You've got this! 💪",
      };

      const key = Object.keys(fallbackResponses).find((k) =>
        text.toLowerCase().includes(k)
      );

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            fallbackResponses[key || ""] ||
            `Great question! Here's what I think about "${text.trim()}":\n\nThis is an important topic. I'd recommend:\n1. Check your NCERT textbook chapter on this\n2. Practice related questions\n3. Make short notes for revision\n\n💡 Start the backend server for more detailed AI-powered answers!`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="chatbot-fab"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI Tutor Chat"
        >
          <MessageCircle size={24} />
          <span className="chatbot-fab-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`chatbot-window ${minimized ? "minimized" : ""}`}>
          {/* Header */}
          <div className="chatbot-header" onClick={() => minimized && setMinimized(false)}>
            <div className="chatbot-header-info">
              <span className="chatbot-avatar">
                <Bot size={18} />
              </span>
              <div>
                <strong>EduSpark AI Tutor</strong>
                <small>
                  <span className="chatbot-online-dot" />
                  Always online
                </small>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button type="button" onClick={() => setMinimized(!minimized)} aria-label="Minimize">
                {minimized ? <ChevronDown size={16} /> : <Minimize2 size={16} />}
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={16} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="chatbot-messages" ref={scrollRef}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`chatbot-msg ${msg.role}`}>
                    {msg.role === "assistant" && (
                      <span className="chatbot-msg-avatar">
                        <Sparkles size={12} />
                      </span>
                    )}
                    <div className="chatbot-msg-bubble">
                      <p>{msg.content}</p>
                      <span className="chatbot-msg-time">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="chatbot-msg assistant">
                    <span className="chatbot-msg-avatar">
                      <Sparkles size={12} />
                    </span>
                    <div className="chatbot-msg-bubble typing">
                      <span className="typing-dots">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="chatbot-quick-prompts">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      className="chatbot-quick-btn"
                      type="button"
                      onClick={() => sendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form className="chatbot-input" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your studies..."
                  disabled={loading}
                />
                <button
                  className="chatbot-send"
                  type="submit"
                  disabled={!input.trim() || loading}
                >
                  {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
