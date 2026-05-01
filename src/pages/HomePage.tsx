import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Play,
  PlayCircle,
  X
} from "lucide-react";
import { subjects, courses, journeySteps, quizQuestions, leaderboard, testimonials } from "../data";
import { useToast } from "../contexts/ToastContext";
import { Reveal, Parallax, StaggerContainer, StaggerItem } from "../components/Reveal";
import { StatsRow, SectionHeading, SubjectGrid, CourseGrid, LeaderboardTable, TestimonialsSection } from "../components/Shared";
import { StreakCard, LevelCard, BadgesCard, QuizPanel } from "./PracticePage";

function DemoModal({ onClose }: { onClose: () => void }) {
  const showToast = useToast();

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="EduSpark demo">
      <button className="modal-backdrop" type="button" onClick={onClose} aria-label="Close demo" />
      <div className="demo-modal">
        <button className="close-floating" type="button" onClick={onClose}>
          Close
          <X size={17} />
        </button>
        <div className="demo-frame">
          <button className="demo-play" type="button" onClick={() => showToast("Demo playback would start here.")}>
            <Play size={38} fill="currentColor" />
          </button>
          <p>EduSpark - Learn Without Limits</p>
          <small>2 min overview</small>
        </div>
      </div>
    </div>
  );
}

function SubjectsPreview() {
  return (
    <section className="page-section compact" id="subjects-preview">
      <div className="content-shell">
        <Reveal>
          <SectionHeading
            kicker="Explore"
            title="Browse by Subject"
            action={
              <Link className="section-link" to="/subjects">
                View all subjects
                <ArrowRight size={15} />
              </Link>
            }
          />
        </Reveal>
        <SubjectGrid subjectsToShow={subjects} />
      </div>
    </section>
  );
}

function CoursesPreview() {
  const [category, setCategory] = useState("all");
  const filteredCourses = category === "all" ? courses.slice(0, 6) : courses.filter((course) => course.category === category);

  return (
    <section className="page-section compact">
      <div className="content-shell">
        <Reveal>
          <SectionHeading
            kicker="Popular"
            title="Featured Courses"
            action={<CourseTabs category={category} setCategory={setCategory} />}
          />
        </Reveal>
        <CourseGrid coursesToShow={filteredCourses.slice(0, 6)} />
      </div>
    </section>
  );
}

function CourseTabs({ category, setCategory }: { category: string; setCategory: (v: string) => void }) {
  const showToast = useToast();
  const tabs: [string, string][] = [
    ["all", "All"],
    ["math", "Math"],
    ["science", "Science"],
    ["coding", "Coding"]
  ];

  return (
    <div className="tabs" role="tablist" aria-label="Course categories">
      {tabs.map(([value, label]) => (
        <button
          className={`tab ${category === value ? "active" : ""}`}
          key={value}
          type="button"
          onClick={() => {
            setCategory(value);
            showToast(`Showing ${label.toLowerCase()} courses`);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function JourneySection() {
  return (
    <section className="page-section compact">
      <div className="content-shell">
        <Reveal>
          <div className="center-heading">
            <span className="section-kicker">How it works</span>
            <h2 className="section-title">Your Learning Journey</h2>
          </div>
        </Reveal>
        <StaggerContainer className="journey-grid" staggerDelay={0.1}>
          {journeySteps.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.title}>
                <div className="journey-card">
                  <span className="journey-icon">
                    <Icon size={31} />
                  </span>
                  <div className="journey-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

function PracticePreview() {
  return (
    <section className="page-section compact" id="practice-preview">
      <div className="content-shell">
        <div className="practice-layout">
          <div className="practice-sidebar">
            <StreakCard />
            <LevelCard />
            <BadgesCard />
          </div>
          <QuizPanel compact />
        </div>
      </div>
    </section>
  );
}

function CommunityPreview() {
  return (
    <section className="page-section compact">
      <div className="content-shell">
        <Reveal>
          <div className="center-heading">
            <span className="section-kicker">Community</span>
            <h2 className="section-title">Top Learners This Week</h2>
          </div>
        </Reveal>
        <LeaderboardTable />
      </div>
    </section>
  );
}

function CtaSection() {
  const showToast = useToast();

  return (
    <section className="page-section cta-section">
      <div className="content-shell narrow center-heading">
        <Parallax speed={0.12}>
          <Reveal>
            <h2 className="cta-title">
              Start Your
              <br />
              Learning Journey
              <br />
              <span>Today</span>
            </h2>
            <p>
              Join millions of learners worldwide. No fees, no ads, no subscriptions. Just knowledge
              waiting to be unlocked.
            </p>
            <div className="hero-actions">
              <Link className="pill-button large" to="/courses" onClick={() => showToast("Welcome aboard. Pick your first course.")}>
                Join for Free
                <ArrowRight size={16} />
              </Link>
              <Link className="outline-button large" to="/courses">
                Explore Courses
              </Link>
            </div>
          </Reveal>
        </Parallax>
      </div>
    </section>
  );
}

export function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const showToast = useToast();

  return (
    <>
      <section className="hero-section page-section">
        <div className="hero-shell">
          <Reveal>
            <div className="live-chip">
              <span />
              12,400+ learners online now
            </div>
          </Reveal>
          <Parallax speed={0.15}>
            <Reveal delay={100}>
              <h1 className="hero-title">
                Learn
                <br />
                Without
                <br />
                <span>Limits</span>
              </h1>
            </Reveal>
          </Parallax>
          <Parallax speed={0.08}>
            <Reveal delay={200}>
              <p className="hero-copy">
                Master any subject with interactive lessons, practice exercises, and expert guidance. Free,
                focused, and built for momentum.
              </p>
            </Reveal>
          </Parallax>
          <Reveal delay={300}>
            <div className="hero-actions">
              <Link className="pill-button large" to="/courses" onClick={() => showToast("Choose a course and start learning.")}>
                Start Learning
                <ArrowRight size={16} />
              </Link>
              <button className="outline-button large" type="button" onClick={() => setDemoOpen(true)}>
                <PlayCircle size={18} />
                Watch Demo
              </button>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <StatsRow />
          </Reveal>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <ChevronDown size={18} />
        </div>
      </section>

      <SubjectsPreview />
      <CoursesPreview />
      <JourneySection />
      <PracticePreview />
      <CommunityPreview />
      <TestimonialsSection />
      <CtaSection />

      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}
    </>
  );
}
