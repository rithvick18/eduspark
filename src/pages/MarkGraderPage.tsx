import { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileText,
  Loader2,
  PenTool,
  Star,
  Target,
  TrendingUp,
  Upload,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Shared";

/* ── Types ── */
interface GradedAnswer {
  question: string;
  studentAnswer: string;
  maxMarks: number;
  scoredMarks: number;
  feedback: string;
  status: "correct" | "partial" | "incorrect";
}

interface GradeResult {
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  answers: GradedAnswer[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

/* ── Mock grading function ── */
function mockGrade(questions: string[], answers: string[], marksPerQ: number[]): GradeResult {
  const graded: GradedAnswer[] = questions.map((q, i) => {
    const ans = answers[i] || "";
    const maxM = marksPerQ[i] || 5;
    let scored: number;
    let status: "correct" | "partial" | "incorrect";
    let feedback: string;

    if (ans.length > 50) {
      scored = Math.round(maxM * (0.7 + Math.random() * 0.3));
      status = scored >= maxM * 0.8 ? "correct" : "partial";
      feedback = scored === maxM
        ? "Excellent! Well-structured answer covering all key points."
        : "Good attempt. Include more specific examples and textbook references for full marks.";
    } else if (ans.length > 10) {
      scored = Math.round(maxM * (0.3 + Math.random() * 0.4));
      status = "partial";
      feedback = "Answer is too brief. Expand with definitions, examples, and diagrams where applicable.";
    } else if (ans.length > 0) {
      scored = Math.round(maxM * 0.2);
      status = "incorrect";
      feedback = "Answer lacks depth. Review the chapter and focus on key terminology.";
    } else {
      scored = 0;
      status = "incorrect";
      feedback = "Not attempted. This question carries significant marks.";
    }

    return { question: q, studentAnswer: ans, maxMarks: maxM, scoredMarks: scored, feedback, status };
  });

  const totalMarks = graded.reduce((a, g) => a + g.scoredMarks, 0);
  const maxMarks = graded.reduce((a, g) => a + g.maxMarks, 0);
  const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
  const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : percentage >= 60 ? "B" : percentage >= 50 ? "C" : percentage >= 35 ? "D" : "F";

  return {
    totalMarks,
    maxMarks,
    percentage,
    grade,
    answers: graded,
    overallFeedback: percentage >= 80
      ? "Outstanding performance! You have a strong understanding of the material."
      : percentage >= 60
      ? "Good work! With more practice on weak areas, you can score even higher."
      : "Keep practicing! Focus on the fundamentals and textbook exercises.",
    strengths: graded.filter((g) => g.status === "correct").map((g) => g.question.slice(0, 40) + "..."),
    improvements: graded.filter((g) => g.status !== "correct").map((g) => g.question.slice(0, 40) + "..."),
  };
}

/* ── Components ── */

function AnswerInputForm({
  onGrade,
  loading,
}: {
  onGrade: (questions: string[], answers: string[], marks: number[]) => void;
  loading: boolean;
}) {
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<string[]>(Array(5).fill(""));
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [marks, setMarks] = useState<number[]>(Array(5).fill(5));
  const [subject, setSubject] = useState("Science");
  const [chapter, setChapter] = useState("Life Processes");

  const updateCount = (count: number) => {
    const c = Math.max(1, Math.min(20, count));
    setQuestionCount(c);
    setQuestions((prev) => {
      const arr = [...prev];
      while (arr.length < c) arr.push("");
      return arr.slice(0, c);
    });
    setAnswers((prev) => {
      const arr = [...prev];
      while (arr.length < c) arr.push("");
      return arr.slice(0, c);
    });
    setMarks((prev) => {
      const arr = [...prev];
      while (arr.length < c) arr.push(5);
      return arr.slice(0, c);
    });
  };

  return (
    <Reveal>
      <div className="grader-input-panel">
        <div className="grader-input-header">
          <div className="grader-icon">
            <PenTool size={24} />
          </div>
          <div>
            <span className="section-kicker">Input</span>
            <h2>Enter Test Answers</h2>
            <p>Type or paste your questions and answers for AI-powered grading</p>
          </div>
        </div>

        <div className="grader-config">
          <label>
            <span>Subject</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option>Science</option>
              <option>Maths</option>
              <option>Social Science</option>
              <option>English</option>
            </select>
          </label>
          <label>
            <span>Chapter</span>
            <select value={chapter} onChange={(e) => setChapter(e.target.value)}>
              <option>Life Processes</option>
              <option>Light</option>
              <option>Quadratic Equations</option>
              <option>Nationalism in India</option>
            </select>
          </label>
          <label>
            <span>Questions</span>
            <div className="qp-counter">
              <button type="button" onClick={() => updateCount(questionCount - 1)}>−</button>
              <span>{questionCount}</span>
              <button type="button" onClick={() => updateCount(questionCount + 1)}>+</button>
            </div>
          </label>
        </div>

        <div className="grader-qa-list">
          {Array.from({ length: questionCount }, (_, i) => (
            <div className="grader-qa-item" key={i}>
              <div className="grader-qa-header">
                <span className="grader-qa-num">Q{i + 1}</span>
                <label className="grader-marks-label">
                  Marks:
                  <input
                    type="number"
                    value={marks[i]}
                    onChange={(e) => {
                      const m = [...marks];
                      m[i] = Number(e.target.value);
                      setMarks(m);
                    }}
                    min={1}
                    max={20}
                  />
                </label>
              </div>
              <input
                className="grader-q-input"
                placeholder={`Enter question ${i + 1}...`}
                value={questions[i]}
                onChange={(e) => {
                  const q = [...questions];
                  q[i] = e.target.value;
                  setQuestions(q);
                }}
              />
              <textarea
                className="grader-a-input"
                placeholder={`Enter student's answer for Q${i + 1}...`}
                value={answers[i]}
                onChange={(e) => {
                  const a = [...answers];
                  a[i] = e.target.value;
                  setAnswers(a);
                }}
                rows={3}
              />
            </div>
          ))}
        </div>

        <div className="grader-submit-row">
          <div className="qp-summary-chip">
            <span>{questionCount} Questions</span>
            <span>•</span>
            <span>{marks.reduce((a, b) => a + b, 0)} Total Marks</span>
          </div>
          <button
            className="pill-button large"
            type="button"
            onClick={() => onGrade(questions, answers, marks)}
            disabled={loading}
          >
            {loading ? <Loader2 className="spin" size={16} /> : <ClipboardCheck size={16} />}
            Grade Answers
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function GradeResultView({ result }: { result: GradeResult }) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const showToast = useToast();

  const statusColors = {
    correct: "#4ade80",
    partial: "#fbbf24",
    incorrect: "#f87171",
  };

  return (
    <div className="grader-result">
      {/* Score Overview */}
      <Reveal>
        <div className="grader-score-overview">
          <div className="grader-score-ring-container">
            <svg viewBox="0 0 120 120" className="grader-score-ring">
              <circle cx="60" cy="60" r="52" className="gsr-bg" />
              <circle
                cx="60"
                cy="60"
                r="52"
                className="gsr-fill"
                strokeDasharray={`${result.percentage * 3.27} 327`}
                style={{
                  stroke:
                    result.percentage >= 80
                      ? "#4ade80"
                      : result.percentage >= 60
                      ? "#fbbf24"
                      : "#f87171",
                }}
              />
            </svg>
            <div className="gsr-text">
              <span className="gsr-percent">{result.percentage}%</span>
              <span className="gsr-grade">{result.grade}</span>
            </div>
          </div>
          <div className="grader-score-details">
            <h2>
              {result.totalMarks} / {result.maxMarks}
            </h2>
            <p>{result.overallFeedback}</p>
            <div className="grader-score-stats">
              <div>
                <CheckCircle2 size={16} style={{ color: "#4ade80" }} />
                <span>{result.answers.filter((a) => a.status === "correct").length} Correct</span>
              </div>
              <div>
                <AlertCircle size={16} style={{ color: "#fbbf24" }} />
                <span>{result.answers.filter((a) => a.status === "partial").length} Partial</span>
              </div>
              <div>
                <XCircle size={16} style={{ color: "#f87171" }} />
                <span>{result.answers.filter((a) => a.status === "incorrect").length} Incorrect</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Individual Answers */}
      <Reveal delay={100}>
        <div className="grader-answers-panel">
          <div className="analysis-panel-header">
            <div>
              <span className="section-kicker">Detailed</span>
              <h2>Answer Review</h2>
            </div>
            <button className="pill-button small" type="button" onClick={() => showToast("Report downloaded!")}>
              <Download size={14} />
              Download Report
            </button>
          </div>
          <div className="grader-answers-list">
            {result.answers.map((ans, idx) => (
              <div
                className={`grader-answer-item ${ans.status}`}
                key={idx}
                onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
              >
                <div className="ga-header">
                  <span className="ga-status-dot" style={{ background: statusColors[ans.status] }} />
                  <span className="ga-q-num">Q{idx + 1}</span>
                  <span className="ga-question">{ans.question || `Question ${idx + 1}`}</span>
                  <span className="ga-score">
                    {ans.scoredMarks}/{ans.maxMarks}
                  </span>
                  <ChevronRight size={16} className={`ga-chevron ${expandedQ === idx ? "rotated" : ""}`} />
                </div>
                {expandedQ === idx && (
                  <div className="ga-details">
                    {ans.studentAnswer && (
                      <div className="ga-student-answer">
                        <h4>Student's Answer:</h4>
                        <p>{ans.studentAnswer}</p>
                      </div>
                    )}
                    <div className="ga-feedback">
                      <h4>Feedback:</h4>
                      <p>{ans.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Insights */}
      <div className="grader-insights-grid">
        {result.strengths.length > 0 && (
          <Reveal>
            <div className="grader-insight-card strengths">
              <h3><CheckCircle2 size={18} /> Strengths</h3>
              <ul>
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
        {result.improvements.length > 0 && (
          <Reveal delay={100}>
            <div className="grader-insight-card improvements">
              <h3><TrendingUp size={18} /> Areas to Improve</h3>
              <ul>
                {result.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function GraderHeroVisual() {
  return (
    <div className="grader-hero-visual">
      <div className="grader-hero-card">
        <div className="ghc-header">
          <ClipboardCheck size={22} />
          <span>Auto Grader</span>
        </div>
        <div className="ghc-score-bar">
          <div className="ghc-bar-track">
            <div className="ghc-bar-fill" style={{ width: "78%" }} />
          </div>
          <span>78%</span>
        </div>
        <div className="ghc-results-mini">
          <span className="ghc-dot correct" />
          <span className="ghc-dot correct" />
          <span className="ghc-dot partial" />
          <span className="ghc-dot correct" />
          <span className="ghc-dot incorrect" />
        </div>
        <div className="ghc-grade">B+</div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function MarkGraderPage() {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);

  const handleGrade = async (questions: string[], answers: string[], marks: number[]) => {
    setLoading(true);
    // Simulate AI grading delay
    await new Promise((r) => setTimeout(r, 1500));
    const gradeResult = mockGrade(questions, answers, marks);
    setResult(gradeResult);
    showToast(`Grading complete! Score: ${gradeResult.totalMarks}/${gradeResult.maxMarks} (${gradeResult.grade})`);
    setLoading(false);
  };

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Mark Grader"
          title="AI-Powered Test Grading"
          copy="Enter your test questions and student answers for instant AI evaluation. Get detailed feedback, scores, and improvement suggestions."
          visual={<GraderHeroVisual />}
        />
        <AnswerInputForm onGrade={handleGrade} loading={loading} />
        {result && <GradeResultView result={result} />}
      </div>
    </section>
  );
}
