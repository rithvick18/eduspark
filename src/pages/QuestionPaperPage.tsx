import { useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Filter,
  Loader2,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Shuffle,
  Star,
  Zap,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Shared";
import { contentAPI, type GeneratedPaper } from "../services/api";

/* ── Past Year Paper Database (mock) ── */
const pastYearPapers = [
  { year: "2025", board: "CBSE", subject: "Science", chapters: ["Chemical Reactions", "Acids Bases", "Life Processes", "Light", "Electricity"], totalMarks: 80 },
  { year: "2024", board: "CBSE", subject: "Science", chapters: ["Metals Nonmetals", "Carbon Compounds", "Heredity", "Magnetic Effects", "Our Environment"], totalMarks: 80 },
  { year: "2025", board: "CBSE", subject: "Maths", chapters: ["Real Numbers", "Polynomials", "Quadratic Equations", "Triangles", "Circles"], totalMarks: 80 },
  { year: "2024", board: "CBSE", subject: "Maths", chapters: ["Arithmetic Progressions", "Coordinate Geometry", "Areas of Circles", "Statistics", "Probability"], totalMarks: 80 },
  { year: "2025", board: "ICSE", subject: "Science", chapters: ["Force Work Energy", "Machines", "Acids Bases Salts", "Mole Concept", "Organic Chemistry"], totalMarks: 80 },
  { year: "2024", board: "ICSE", subject: "Mathematics", chapters: ["Quadratic Equations", "Ratio Proportion", "Matrices", "Coordinate Geometry", "Probability"], totalMarks: 80 },
  { year: "2025", board: "CBSE", subject: "Social Science", chapters: ["Nationalism in India", "Resources and Development", "Money and Credit", "Power Sharing", "Globalisation"], totalMarks: 80 },
  { year: "2024", board: "CBSE", subject: "Social Science", chapters: ["French Revolution", "Forest Society", "Electoral Politics", "Food Security"], totalMarks: 80 },
];

/* ── Components ── */

function PaperGeneratorForm({
  onGenerate,
  loading,
}: {
  onGenerate: (config: PaperConfig) => void;
  loading: boolean;
}) {
  const [board, setBoard] = useState("CBSE");
  const [subject, setSubject] = useState("Science");
  const [year, setYear] = useState("2025");
  const [chapters, setChapters] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState({ mcq: 10, short: 5, long: 3 });
  const [marks, setMarks] = useState(80);
  const [duration, setDuration] = useState(180);

  const relevantPapers = pastYearPapers.filter(
    (p) => p.board === board && p.subject === subject
  );
  const availableChapters = [...new Set(relevantPapers.flatMap((p) => p.chapters))];

  const toggleChapter = (ch: string) => {
    setChapters((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  return (
    <Reveal>
      <div className="qp-generator-panel">
        <div className="qp-generator-header">
          <div className="qp-gen-icon">
            <FileText size={24} />
          </div>
          <div>
            <span className="section-kicker">AI Paper Generator</span>
            <h2>Generate Question Paper</h2>
            <p>Select parameters from past year patterns to generate a custom paper</p>
          </div>
        </div>

        <div className="qp-form-grid">
          <div className="qp-form-section">
            <h3><Settings size={16} /> Basic Configuration</h3>
            <div className="qp-form-row">
              <label>
                <span>Board</span>
                <select value={board} onChange={(e) => { setBoard(e.target.value); setChapters([]); }}>
                  <option>CBSE</option>
                  <option>ICSE</option>
                  <option>State</option>
                </select>
              </label>
              <label>
                <span>Subject</span>
                <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapters([]); }}>
                  <option>Science</option>
                  <option>Maths</option>
                  <option>Social Science</option>
                  <option>English</option>
                  <option>Mathematics</option>
                </select>
              </label>
              <label>
                <span>Reference Year</span>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </label>
              <label>
                <span>Difficulty</span>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
          </div>

          <div className="qp-form-section">
            <h3><Filter size={16} /> Chapter Selection</h3>
            <div className="qp-chapter-chips">
              {availableChapters.length > 0 ? (
                availableChapters.map((ch) => (
                  <button
                    key={ch}
                    className={`qp-chapter-chip ${chapters.includes(ch) ? "selected" : ""}`}
                    type="button"
                    onClick={() => toggleChapter(ch)}
                  >
                    {chapters.includes(ch) && <CheckCircle2 size={13} />}
                    {ch}
                  </button>
                ))
              ) : (
                <p className="qp-no-chapters">Select board and subject to see available chapters</p>
              )}
            </div>
            <button
              className="qp-select-all"
              type="button"
              onClick={() =>
                setChapters(
                  chapters.length === availableChapters.length ? [] : [...availableChapters]
                )
              }
            >
              <Shuffle size={14} />
              {chapters.length === availableChapters.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="qp-form-section">
            <h3><BookOpen size={16} /> Paper Structure</h3>
            <div className="qp-structure-grid">
              <div className="qp-structure-item">
                <span>MCQs (1 mark each)</span>
                <div className="qp-counter">
                  <button type="button" onClick={() => setQuestionCount((p) => ({ ...p, mcq: Math.max(0, p.mcq - 1) }))}>−</button>
                  <span>{questionCount.mcq}</span>
                  <button type="button" onClick={() => setQuestionCount((p) => ({ ...p, mcq: p.mcq + 1 }))}>+</button>
                </div>
              </div>
              <div className="qp-structure-item">
                <span>Short Answer (2 marks)</span>
                <div className="qp-counter">
                  <button type="button" onClick={() => setQuestionCount((p) => ({ ...p, short: Math.max(0, p.short - 1) }))}>−</button>
                  <span>{questionCount.short}</span>
                  <button type="button" onClick={() => setQuestionCount((p) => ({ ...p, short: p.short + 1 }))}>+</button>
                </div>
              </div>
              <div className="qp-structure-item">
                <span>Long Answer (5 marks)</span>
                <div className="qp-counter">
                  <button type="button" onClick={() => setQuestionCount((p) => ({ ...p, long: Math.max(0, p.long - 1) }))}>−</button>
                  <span>{questionCount.long}</span>
                  <button type="button" onClick={() => setQuestionCount((p) => ({ ...p, long: p.long + 1 }))}>+</button>
                </div>
              </div>
            </div>
            <div className="qp-form-row compact">
              <label>
                <span>Total Marks</span>
                <input type="number" value={marks} onChange={(e) => setMarks(Number(e.target.value))} />
              </label>
              <label>
                <span>Duration (min)</span>
                <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </label>
            </div>
          </div>
        </div>

        <div className="qp-generate-actions">
          <div className="qp-summary-chip">
            <span>{questionCount.mcq + questionCount.short + questionCount.long} Questions</span>
            <span>•</span>
            <span>{marks} Marks</span>
            <span>•</span>
            <span>{duration} min</span>
          </div>
          <button
            className="pill-button large"
            type="button"
            onClick={() =>
              onGenerate({ board, subject, year, chapters, difficulty, questionCount, marks, duration })
            }
            disabled={loading}
          >
            {loading ? <Loader2 className="spin" size={16} /> : <Zap size={16} />}
            Generate Paper
          </button>
        </div>
      </div>
    </Reveal>
  );
}

interface PaperConfig {
  board: string;
  subject: string;
  year: string;
  chapters: string[];
  difficulty: string;
  questionCount: { mcq: number; short: number; long: number };
  marks: number;
  duration: number;
}

function GeneratedPaperView({
  paper,
  config,
}: {
  paper: GeneratedPaper;
  config: PaperConfig;
}) {
  const showToast = useToast();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <Reveal>
      <div className="qp-paper-view">
        <div className="qp-paper-header">
          <div className="qp-paper-title">
            <FileText size={24} />
            <div>
              <h2>{config.board} Class 10 — {config.subject}</h2>
              <p>
                Based on {config.year} pattern • {config.difficulty} difficulty •{" "}
                {config.marks} marks • {config.duration} min
              </p>
            </div>
          </div>
          <div className="qp-paper-actions">
            <button className="outline-button" type="button" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? "Hide Answers" : "Show Answers"}
            </button>
            <button className="outline-button" type="button" onClick={() => showToast("Printing paper...")}>
              <Printer size={15} />
              Print
            </button>
            <button className="pill-button small" type="button" onClick={() => showToast("Paper downloaded!")}>
              <Download size={15} />
              Download
            </button>
          </div>
        </div>

        {paper.mcqs && paper.mcqs.length > 0 && (
          <div className="qp-section">
            <h3 className="qp-section-title">
              <span className="qp-section-badge">Section A</span>
              Multiple Choice Questions
              <small>({paper.mcqs.length} × 1 = {paper.mcqs.length} marks)</small>
            </h3>
            <div className="qp-questions">
              {paper.mcqs.map((q, idx) => (
                <div className="qp-question mcq" key={idx}>
                  <span className="qp-q-num">Q{idx + 1}.</span>
                  <div className="qp-q-content">
                    <p>{q.q}</p>
                    <div className="qp-options">
                      {q.options.map((opt, oi) => (
                        <span
                          key={oi}
                          className={`qp-option ${showAnswers && String.fromCharCode(65 + oi) === q.correct ? "correct" : ""}`}
                        >
                          <span>{String.fromCharCode(65 + oi)}</span>
                          {opt}
                        </span>
                      ))}
                    </div>
                    {showAnswers && (
                      <div className="qp-answer">
                        <CheckCircle2 size={14} />
                        Answer: {q.correct}
                      </div>
                    )}
                  </div>
                  <span className="qp-marks">[1]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {paper.short && paper.short.length > 0 && (
          <div className="qp-section">
            <h3 className="qp-section-title">
              <span className="qp-section-badge">Section B</span>
              Short Answer Questions
              <small>({paper.short.length} × 2 = {paper.short.length * 2} marks)</small>
            </h3>
            <div className="qp-questions">
              {paper.short.map((q, idx) => (
                <div className="qp-question short" key={idx}>
                  <span className="qp-q-num">Q{paper.mcqs.length + idx + 1}.</span>
                  <div className="qp-q-content">
                    <p>{q.q}</p>
                    {showAnswers && (
                      <div className="qp-answer">
                        <CheckCircle2 size={14} />
                        {q.answer}
                      </div>
                    )}
                  </div>
                  <span className="qp-marks">[2]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {paper.long && paper.long.length > 0 && (
          <div className="qp-section">
            <h3 className="qp-section-title">
              <span className="qp-section-badge">Section C</span>
              Long Answer Questions
              <small>({paper.long.length} × 5 = {paper.long.length * 5} marks)</small>
            </h3>
            <div className="qp-questions">
              {paper.long.map((q, idx) => (
                <div className="qp-question long" key={idx}>
                  <span className="qp-q-num">Q{paper.mcqs.length + paper.short.length + idx + 1}.</span>
                  <div className="qp-q-content">
                    <p>{q.q}</p>
                    {showAnswers && (
                      <div className="qp-answer">
                        <CheckCircle2 size={14} />
                        {q.answer}
                      </div>
                    )}
                  </div>
                  <span className="qp-marks">[5]</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

function PastYearBrowser() {
  const [filterBoard, setFilterBoard] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  const filtered = pastYearPapers.filter(
    (p) =>
      (filterBoard === "all" || p.board === filterBoard) &&
      (filterSubject === "all" || p.subject === filterSubject)
  );

  return (
    <section className="qp-past-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Archives</span>
          <h2 className="section-title">Past Year Papers</h2>
        </div>
        <div className="qp-filter-row">
          <select value={filterBoard} onChange={(e) => setFilterBoard(e.target.value)}>
            <option value="all">All Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
          </select>
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="all">All Subjects</option>
            <option>Science</option>
            <option>Maths</option>
            <option>Mathematics</option>
            <option>Social Science</option>
          </select>
        </div>
      </div>
      <StaggerContainer className="past-papers-grid" staggerDelay={0.06}>
        {filtered.map((paper, idx) => (
          <StaggerItem key={idx}>
            <div className="past-paper-card">
              <div className="ppc-header">
                <span className="ppc-year">{paper.year}</span>
                <span className="ppc-board">{paper.board}</span>
              </div>
              <h3>{paper.subject}</h3>
              <div className="ppc-chapters">
                {paper.chapters.slice(0, 3).map((ch) => (
                  <span key={ch} className="ppc-chip">{ch}</span>
                ))}
                {paper.chapters.length > 3 && (
                  <span className="ppc-chip more">+{paper.chapters.length - 3} more</span>
                )}
              </div>
              <div className="ppc-footer">
                <span>{paper.totalMarks} marks</span>
                <Star size={14} />
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function QPHeroVisual() {
  return (
    <div className="qp-hero-visual">
      <div className="qp-paper-stack">
        <div className="qp-paper-sheet qp-sheet-3">
          <div className="qp-sheet-lines">
            <span /><span /><span /><span />
          </div>
        </div>
        <div className="qp-paper-sheet qp-sheet-2">
          <div className="qp-sheet-lines">
            <span /><span /><span /><span />
          </div>
        </div>
        <div className="qp-paper-sheet qp-sheet-1">
          <div className="qp-sheet-header">
            <FileText size={18} />
            <span>Question Paper</span>
          </div>
          <div className="qp-sheet-lines">
            <span /><span /><span /><span /><span />
          </div>
          <div className="qp-sheet-stamp">
            <Zap size={16} />
            <span>AI Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function QuestionPaperPage() {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedPaper | null>(null);
  const [paperConfig, setPaperConfig] = useState<PaperConfig | null>(null);

  const handleGenerate = async (config: PaperConfig) => {
    setLoading(true);
    setPaperConfig(config);
    try {
      const chapter = config.chapters[0] || "General";
      const paper = await contentAPI.generatePaper(config.board, config.subject, chapter, config.difficulty);
      setGeneratedPaper(paper);
      showToast(paper.cached ? "Loaded cached paper." : "Question paper generated from past year patterns! 📝");
    } catch {
      // Use a mock paper as fallback
      setGeneratedPaper({
        mcqs: Array.from({ length: config.questionCount.mcq }, (_, i) => ({
          q: `Sample MCQ ${i + 1}: Based on ${config.subject} ${config.year} pattern — which of the following is correct?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        })),
        short: Array.from({ length: config.questionCount.short }, (_, i) => ({
          q: `Sample Short Q${i + 1}: Explain a key concept from ${config.subject} based on the ${config.year} syllabus.`,
          answer: "Reference the textbook definition, provide one example, and connect to the main idea.",
        })),
        long: Array.from({ length: config.questionCount.long }, (_, i) => ({
          q: `Sample Long Q${i + 1}: Describe in detail with diagram and examples from ${config.subject}.`,
          answer: "Cover the definition, diagram, working principle, 2 examples, and significance.",
        })),
      });
      showToast("Generated sample paper (start backend for AI-powered papers).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Question Papers"
          title="Generate From Past Year Data"
          copy="Create custom question papers based on past year exam patterns. Select your board, subject, chapters, and difficulty to generate a comprehensive practice paper."
          visual={<QPHeroVisual />}
        />
        <PaperGeneratorForm onGenerate={handleGenerate} loading={loading} />
        {generatedPaper && paperConfig && (
          <GeneratedPaperView paper={generatedPaper} config={paperConfig} />
        )}
        <PastYearBrowser />
      </div>
    </section>
  );
}
