import { useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  Lightbulb,
  LineChart,
  Minus,
  PieChart,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Shared";

/* ── Mock Student Data ── */
const overviewStats = [
  { label: "Total Study Hours", value: "186h", change: "+12%", trend: "up", icon: Clock },
  { label: "Quizzes Completed", value: "234", change: "+28", trend: "up", icon: Target },
  { label: "Average Score", value: "78%", change: "+5%", trend: "up", icon: TrendingUp },
  { label: "Current Streak", value: "27 days", change: "+3", trend: "up", icon: Flame },
];

const subjectPerformance = [
  { name: "Mathematics", score: 85, grade: "A", trend: "up", color: "#60a5fa", topics: 42, hoursSpent: 48, weakAreas: ["Trigonometry", "Statistics"], strongAreas: ["Algebra", "Number Systems"] },
  { name: "Science", score: 78, grade: "B+", trend: "up", color: "#4ade80", topics: 38, hoursSpent: 42, weakAreas: ["Organic Chemistry", "Optics"], strongAreas: ["Biology", "Electricity"] },
  { name: "Social Science", score: 72, grade: "B", trend: "stable", color: "#fbbf24", topics: 35, hoursSpent: 30, weakAreas: ["Economics", "Map Work"], strongAreas: ["History", "Civics"] },
  { name: "English", score: 88, grade: "A", trend: "up", color: "#f472b6", topics: 28, hoursSpent: 22, weakAreas: ["Grammar Rules", "Comprehension Speed"], strongAreas: ["Writing", "Literature"] },
  { name: "Hindi", score: 65, grade: "B-", trend: "down", color: "#c084fc", topics: 20, hoursSpent: 15, weakAreas: ["Grammar", "Unseen Passage"], strongAreas: ["Poetry", "Story Writing"] },
];

const weeklyActivity = [
  { day: "Mon", hours: 3.5, quizzes: 4 },
  { day: "Tue", hours: 2.8, quizzes: 3 },
  { day: "Wed", hours: 4.2, quizzes: 6 },
  { day: "Thu", hours: 1.5, quizzes: 2 },
  { day: "Fri", hours: 3.0, quizzes: 5 },
  { day: "Sat", hours: 5.1, quizzes: 8 },
  { day: "Sun", hours: 4.0, quizzes: 4 },
];

const recentTests = [
  { subject: "Mathematics", chapter: "Quadratic Equations", score: 92, total: 100, date: "2 days ago", grade: "A+" },
  { subject: "Science", chapter: "Light – Reflection", score: 78, total: 100, date: "3 days ago", grade: "B+" },
  { subject: "English", chapter: "First Flight Ch.3", score: 85, total: 100, date: "5 days ago", grade: "A" },
  { subject: "Social Science", chapter: "Nationalism", score: 70, total: 100, date: "1 week ago", grade: "B" },
  { subject: "Science", chapter: "Chemical Reactions", score: 88, total: 100, date: "1 week ago", grade: "A" },
];

const recommendations = [
  { title: "Focus on Trigonometry", desc: "Your scores dropped 12% in recent trig quizzes. Practice special angles.", icon: Brain, priority: "high" },
  { title: "Increase Science Study Time", desc: "Spending 15min more daily on Science can boost your grade to A.", icon: Clock, priority: "medium" },
  { title: "Review Organic Chemistry", desc: "You missed 4 out of 5 nomenclature questions. Revisit IUPAC rules.", icon: Lightbulb, priority: "high" },
  { title: "Keep up with English!", desc: "You're on track for a top grade. Maintain your reading habit.", icon: Star, priority: "low" },
];

/* ── Components ── */

function OverviewCards() {
  return (
    <StaggerContainer className="analysis-overview-grid" staggerDelay={0.07}>
      {overviewStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <StaggerItem key={stat.label}>
            <div className="analysis-overview-card">
              <div className="analysis-card-icon">
                <Icon size={20} />
              </div>
              <div className="analysis-card-content">
                <span className="analysis-card-value">{stat.value}</span>
                <span className="analysis-card-label">{stat.label}</span>
              </div>
              <span className={`analysis-trend ${stat.trend}`}>
                {stat.trend === "up" ? <ArrowUp size={13} /> : stat.trend === "down" ? <ArrowDown size={13} /> : <Minus size={13} />}
                {stat.change}
              </span>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

function SubjectRadar() {
  const maxScore = 100;
  const barMaxWidth = 100;

  return (
    <Reveal>
      <div className="analysis-panel subject-performance-panel">
        <div className="analysis-panel-header">
          <div>
            <span className="section-kicker">Performance</span>
            <h2>Subject Breakdown</h2>
          </div>
          <BarChart3 size={20} className="panel-icon" />
        </div>
        <div className="subject-bars">
          {subjectPerformance.map((sub) => {
            const pct = (sub.score / maxScore) * barMaxWidth;
            return (
              <div className="subject-bar-row" key={sub.name}>
                <span className="subject-bar-name">{sub.name}</span>
                <div className="subject-bar-track">
                  <div
                    className="subject-bar-fill"
                    style={{ width: `${pct}%`, background: sub.color }}
                  />
                </div>
                <span className="subject-bar-score">{sub.score}%</span>
                <span className="subject-bar-grade" style={{ color: sub.color }}>
                  {sub.grade}
                </span>
                <span className={`analysis-trend ${sub.trend}`}>
                  {sub.trend === "up" ? <ArrowUp size={11} /> : sub.trend === "down" ? <ArrowDown size={11} /> : <Minus size={11} />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function WeeklyHeatmap() {
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

  return (
    <Reveal delay={100}>
      <div className="analysis-panel weekly-panel">
        <div className="analysis-panel-header">
          <div>
            <span className="section-kicker">This Week</span>
            <h2>Study Activity</h2>
          </div>
          <Activity size={20} className="panel-icon" />
        </div>
        <div className="weekly-chart">
          {weeklyActivity.map((day) => {
            const height = (day.hours / maxHours) * 100;
            return (
              <div className="weekly-bar-col" key={day.day}>
                <div className="weekly-bar-value">{day.hours}h</div>
                <div className="weekly-bar-track">
                  <div
                    className="weekly-bar-fill"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="weekly-bar-label">{day.day}</span>
              </div>
            );
          })}
        </div>
        <div className="weekly-summary">
          <div>
            <strong>{weeklyActivity.reduce((a, d) => a + d.hours, 0).toFixed(1)}h</strong>
            <small>Total This Week</small>
          </div>
          <div>
            <strong>{weeklyActivity.reduce((a, d) => a + d.quizzes, 0)}</strong>
            <small>Quizzes Taken</small>
          </div>
          <div>
            <strong>{(weeklyActivity.reduce((a, d) => a + d.hours, 0) / 7).toFixed(1)}h</strong>
            <small>Daily Average</small>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function SubjectDetailCards() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="analysis-detail-section">
      <SectionHeading kicker="Deep Dive" title="Subject Analysis" />
      <StaggerContainer className="subject-detail-grid" staggerDelay={0.06}>
        {subjectPerformance.map((sub) => (
          <StaggerItem key={sub.name}>
            <div
              className={`subject-analysis-card ${expanded === sub.name ? "expanded" : ""}`}
              style={{ "--accent": sub.color } as React.CSSProperties}
            >
              <div className="sac-header" onClick={() => setExpanded(expanded === sub.name ? null : sub.name)}>
                <div className="sac-score-ring">
                  <svg viewBox="0 0 36 36" className="sac-ring">
                    <path
                      className="sac-ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="sac-ring-fill"
                      strokeDasharray={`${sub.score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span>{sub.score}%</span>
                </div>
                <div className="sac-info">
                  <h3>{sub.name}</h3>
                  <p>{sub.topics} topics · {sub.hoursSpent}h studied</p>
                </div>
                <ChevronRight size={18} className={`sac-chevron ${expanded === sub.name ? "rotated" : ""}`} />
              </div>
              {expanded === sub.name && (
                <div className="sac-details">
                  <div className="sac-areas">
                    <div className="sac-area">
                      <h4>💪 Strong Areas</h4>
                      <div className="sac-tags">
                        {sub.strongAreas.map((a) => (
                          <span key={a} className="sac-tag strong">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div className="sac-area">
                      <h4>⚠️ Needs Work</h4>
                      <div className="sac-tags">
                        {sub.weakAreas.map((a) => (
                          <span key={a} className="sac-tag weak">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function RecentTestsTable() {
  return (
    <Reveal>
      <div className="analysis-panel recent-tests-panel">
        <div className="analysis-panel-header">
          <div>
            <span className="section-kicker">History</span>
            <h2>Recent Tests</h2>
          </div>
          <Calendar size={20} className="panel-icon" />
        </div>
        <div className="recent-tests-table">
          <div className="rtt-head">
            <span>Subject</span>
            <span>Chapter</span>
            <span>Score</span>
            <span>Grade</span>
            <span>Date</span>
          </div>
          {recentTests.map((test, idx) => {
            const pct = (test.score / test.total) * 100;
            return (
              <div className="rtt-row" key={idx}>
                <span className="rtt-subject">{test.subject}</span>
                <span className="rtt-chapter">{test.chapter}</span>
                <span className="rtt-score">
                  <span className="rtt-score-bar">
                    <span style={{ width: `${pct}%` }} />
                  </span>
                  {test.score}/{test.total}
                </span>
                <span className={`rtt-grade ${pct >= 85 ? "excellent" : pct >= 70 ? "good" : "needs-work"}`}>
                  {test.grade}
                </span>
                <span className="rtt-date">{test.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function RecommendationsPanel() {
  const showToast = useToast();
  const priorityColors: Record<string, string> = {
    high: "#f87171",
    medium: "#fbbf24",
    low: "#4ade80",
  };

  return (
    <Reveal delay={100}>
      <div className="analysis-panel recommendations-panel">
        <div className="analysis-panel-header">
          <div>
            <span className="section-kicker">AI Insights</span>
            <h2>Recommendations</h2>
          </div>
          <Lightbulb size={20} className="panel-icon" />
        </div>
        <div className="rec-list">
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div className="rec-item" key={idx}>
                <span
                  className="rec-priority"
                  style={{ background: priorityColors[rec.priority] }}
                />
                <div className="rec-icon">
                  <Icon size={18} />
                </div>
                <div className="rec-content">
                  <h4>{rec.title}</h4>
                  <p>{rec.desc}</p>
                </div>
                <button
                  className="rec-action"
                  type="button"
                  onClick={() => showToast(`Starting practice for: ${rec.title}`)}
                >
                  Practice
                  <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function AnalysisHeroVisual() {
  return (
    <div className="analysis-hero-visual">
      <div className="analysis-glow" />
      <div className="analysis-chart-mock">
        <div className="acm-bars">
          {[65, 78, 85, 72, 88, 92, 80].map((h, i) => (
            <div key={i} className="acm-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <div className="acm-label">
          <TrendingUp size={16} />
          <span>+12% This Month</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function StudentAnalysisPage() {
  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Student Analysis"
          title="Your Learning Analytics"
          copy="Track your progress, identify strengths and weaknesses, and get AI-powered recommendations to optimize your study plan."
          visual={<AnalysisHeroVisual />}
        />
        <OverviewCards />
        <div className="analysis-two-col">
          <SubjectRadar />
          <WeeklyHeatmap />
        </div>
        <SubjectDetailCards />
        <div className="analysis-two-col">
          <RecentTestsTable />
          <RecommendationsPanel />
        </div>
      </div>
    </section>
  );
}
