import { useEffect, useState } from "react";
import { Clock, Flame, Lightbulb } from "lucide-react";
import { badges, quizQuestions } from "../data";
import { useToast } from "../contexts/ToastContext";
import { Reveal } from "../components/Reveal";
import { SectionHeading, PageHero } from "../components/Shared";

export function StreakCard() {
  return (
    <Reveal>
      <article className="metric-card streak-card">
        <div className="card-topline">
          <h3>Daily Streak</h3>
          <Flame size={25} fill="currentColor" />
        </div>
        <div className="streak-number">27</div>
        <p>days in a row. Keep going.</p>
        <div className="week-row" aria-label="Weekly streak">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span className={index < 5 ? "done" : index === 5 ? "today" : ""} key={`${day}-${index}`}>
              {day}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

export function LevelCard() {
  return (
    <Reveal delay={100}>
      <article className="metric-card">
        <div className="card-topline">
          <h3>Your Level</h3>
          <strong>LVL 14</strong>
        </div>
        <div className="level-content">
          <ProgressRing value={75} />
          <div>
            <div className="xp-line">
              4,280 <span>/ 5,700 XP</span>
            </div>
            <p>1,420 XP to next level</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg className="progress-ring" width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <circle cx="29" cy="29" r={radius} />
      <circle
        className="ring-progress"
        cx="29"
        cy="29"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text x="29" y="34" textAnchor="middle">
        {value}%
      </text>
    </svg>
  );
}

export function BadgesCard() {
  return (
    <Reveal delay={150}>
      <article className="metric-card">
        <h3 className="badges-title">Recent Badges</h3>
        <div className="badge-row">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div className="badge-item" style={{ animationDelay: `${index * 0.25}s`, "--accent": badge.accent } as React.CSSProperties} key={badge.label}>
                <span>
                  <Icon size={20} />
                </span>
                <small>{badge.label}</small>
              </div>
            );
          })}
        </div>
      </article>
    </Reveal>
  );
}

function LightbulbIcon() {
  return <span className="hint-dot" aria-hidden="true" />;
}

export function QuizPanel({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(150);
  const showToast = useToast();
  const question = quizQuestions[index];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : value));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const time = `${minutes}:${String(seconds % 60).padStart(2, "0")}`;

  const chooseOption = (optionIndex: number) => {
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) {
      showToast("Correct. Nice work.");
    } else {
      showToast(`Not quite. The answer is ${String.fromCharCode(65 + question.correctIndex)}.`);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setIndex((value) => (value + 1) % quizQuestions.length);
    showToast("Next practice prompt loaded.");
  };

  return (
    <Reveal delay={compact ? 100 : 0} className="quiz-reveal">
      <article className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">Practice</span>
            <h2>{compact ? `Quick Quiz: ${question.topic}` : "Adaptive Practice"}</h2>
          </div>
          <div className="timer-chip">
            <Clock size={16} />
            {time}
          </div>
        </div>
        <div className="question-progress" aria-hidden="true">
          {quizQuestions.map((_, stepIndex) => (
            <span
              className={stepIndex < index ? "complete" : stepIndex === index ? "current" : ""}
              key={stepIndex}
            />
          ))}
        </div>
        <div className="question-copy">
          <p>Question {index + 1} of {quizQuestions.length}</p>
          <h3>{question.prompt}</h3>
        </div>
        <div className="quiz-options">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isCorrect = selected !== null && optionIndex === question.correctIndex;
            const isWrong = isSelected && optionIndex !== question.correctIndex;
            return (
              <button
                className={`quiz-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                disabled={selected !== null}
                key={option}
                type="button"
                onClick={() => chooseOption(optionIndex)}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>
                {option}
              </button>
            );
          })}
        </div>
        <div className="quiz-actions">
          <button className="hint-button" type="button" onClick={() => showToast(question.hint)}>
            <LightbulbIcon />
            Show Hint
          </button>
          <button className="pill-button small" type="button" onClick={nextQuestion}>
            Next Question
          </button>
        </div>
      </article>
    </Reveal>
  );
}

function PracticeVisual() {
  return (
    <div className="practice-visual">
      <div className="practice-visual-card">
        <span>Question 03</span>
        <strong>6x + 2</strong>
        <small>Correct answer</small>
      </div>
      <div className="practice-visual-bar">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function PracticePage() {
  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Practice"
          title="Train Skills Until They Stick"
          copy="Use timed quizzes, hints, progress rings, streaks, and badges to keep each study session concrete and rewarding."
          visual={<PracticeVisual />}
        />
        <div className="practice-layout expanded">
          <div className="practice-sidebar">
            <StreakCard />
            <LevelCard />
            <BadgesCard />
          </div>
          <QuizPanel />
        </div>
      </div>
    </section>
  );
}
