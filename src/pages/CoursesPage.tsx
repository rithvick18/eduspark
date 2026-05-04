import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Loader2,
  Play
} from "lucide-react";
import { courses, learningPaths } from "../data";
import type { Course } from "../types";
import { useToast } from "../contexts/ToastContext";
import { Reveal, Parallax, StaggerContainer, StaggerItem } from "../components/Reveal";
import { SectionHeading, CourseGrid, NotFoundPage } from "../components/Shared";
import { AskTutor } from "../components/AskTutor";
import { contentAPI, type ContentResponse } from "../services/api";

const boardOptions = ["CBSE", "ICSE", "State"];
const subjectOptions = ["Science", "Maths", "Social Science", "English"];
const chapterOptions = ["Life Processes", "Light", "Quadratic Equations", "Nationalism in India"];

export function CoursesPage() {
  const [category, setCategory] = useState("all");
  const [board, setBoard] = useState("CBSE");
  const [subject, setSubject] = useState("Science");
  const [chapter, setChapter] = useState("Life Processes");
  const [topic, setTopic] = useState("Photosynthesis");
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const showToast = useToast();
  const categories = ["all", "math", "science", "coding", "economics", "history"];
  const filteredCourses = category === "all" ? courses : courses.filter((course) => course.category === category);

  useEffect(() => {
    let active = true;

    const timeout = window.setTimeout(() => {
      setLoadingContent(true);
      contentAPI
        .getContent(board, subject, chapter, topic)
        .then((response) => {
          if (!active) return;
          setContent(response);
          if (response.cached) showToast("Showing cached AI content.");
        })
        .catch(() => {
          if (active) showToast("Start the FastAPI backend to load AI-curated content.");
        })
        .finally(() => {
          if (active) setLoadingContent(false);
        });
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [board, subject, chapter, topic, showToast]);

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Course Catalog"
          title="Pick a Course, Keep the Momentum"
          copy="Browse focused, instructor-led courses with progress tracking, ratings, and compact lessons designed for real practice."
          visual={<CatalogVisual />}
        />
        <Reveal>
          <div className="catalog-toolbar">
            <div>
              <span className="section-kicker">Filters</span>
              <h2>Featured Course Library</h2>
            </div>
            <div className="tabs wrap">
              {categories.map((value) => (
                <button
                  className={`tab ${category === value ? "active" : ""}`}
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                >
                  {value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <CurriculumCurator
          board={board}
          subject={subject}
          chapter={chapter}
          topic={topic}
          loading={loadingContent}
          content={content}
          onBoardChange={setBoard}
          onSubjectChange={setSubject}
          onChapterChange={setChapter}
          onTopicChange={setTopic}
        />
        <CourseGrid coursesToShow={filteredCourses} />
        <LearningPaths />
      </div>
    </section>
  );
}

function CurriculumCurator({
  board,
  subject,
  chapter,
  topic,
  loading,
  content,
  onBoardChange,
  onSubjectChange,
  onChapterChange,
  onTopicChange
}: {
  board: string;
  subject: string;
  chapter: string;
  topic: string;
  loading: boolean;
  content: ContentResponse | null;
  onBoardChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onChapterChange: (value: string) => void;
  onTopicChange: (value: string) => void;
}) {
  const videos = content?.data.youtube_videos ?? [];
  const points = content?.data.key_points ?? [];
  const questions = content?.data.practice_questions ?? [];

  return (
    <Reveal>
      <section className="curator-panel">
        <div className="curator-toolbar">
          <div>
            <span className="section-kicker">Board-Aware</span>
            <h2>AI Curated Study Pack</h2>
          </div>
          <div className="curator-controls" aria-label="Curriculum filters">
            <label>
              <span>Board</span>
              <select value={board} onChange={(event) => onBoardChange(event.target.value)}>
                {boardOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Subject</span>
              <select value={subject} onChange={(event) => onSubjectChange(event.target.value)}>
                {subjectOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Chapter</span>
              <select value={chapter} onChange={(event) => onChapterChange(event.target.value)}>
                {chapterOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Topic</span>
              <input value={topic} onChange={(event) => onTopicChange(event.target.value)} placeholder="Topic" />
            </label>
          </div>
        </div>

        <div className="curator-grid">
          <article className="curator-summary">
            <div className="curator-card-heading">
              <h3>{chapter}</h3>
              {loading && <Loader2 className="spin" size={17} />}
            </div>
            <p>{content?.data.summary ?? "FastAPI will curate a summary, textbook pointers, videos, and practice prompts for your selected chapter."}</p>
            {content?.cached && <small className="status-chip">Cached</small>}
            {content?.source && !content.cached && <small className="status-chip">{content.source}</small>}
          </article>

          <article className="curator-list-card">
            <h3>Key Points</h3>
            <ul>
              {(points.length ? points : ["Start the backend to load Gemini-curated key points."]).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="curator-list-card">
            <h3>Practice</h3>
            <ul>
              {(questions.length ? questions.slice(0, 3).map((item) => item.question) : ["Generated practice questions will appear here."]).map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </article>
        </div>

        {videos.length > 0 && (
          <div className="resource-row">
            {videos.slice(0, 3).map((video) => (
              <a className="resource-card" href={video.link} target="_blank" rel="noreferrer" key={video.link}>
                {video.thumbnail && <img src={video.thumbnail} alt="" />}
                <span>
                  <strong>{video.title}</strong>
                  <small>{video.channel || "YouTube"} {video.duration ? `- ${video.duration}` : ""}</small>
                </span>
                <ExternalLink size={15} />
              </a>
            ))}
          </div>
        )}

        <AskTutor board={board} subject={subject} chapter={chapter} topic={topic} />
      </section>
    </Reveal>
  );
}

function CatalogVisual() {
  return (
    <div className="catalog-visual">
      {courses.slice(0, 3).map((course, index) => {
        const Icon = course.icon;
        return (
          <div className="mini-course" style={{ "--accent": course.accent, "--lift": `${index * 16}px` } as React.CSSProperties} key={course.id}>
            <img src={course.image} alt="" />
            <span>
              <Icon size={16} />
            </span>
            <strong>{course.subject}</strong>
            <small>{course.progress}% complete</small>
          </div>
        );
      })}
    </div>
  );
}

function LearningPaths() {
  return (
    <section className="subsection">
      <Reveal>
        <SectionHeading kicker="Guided" title="Learning Paths" />
      </Reveal>
      <StaggerContainer className="path-grid" staggerDelay={0.08}>
        {learningPaths.map((path) => {
          const Icon = path.icon;
          return (
            <StaggerItem key={path.title}>
              <article className="path-card" style={{ "--accent": path.accent } as React.CSSProperties}>
                <span>
                  <Icon size={25} />
                </span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <small>{path.courses} courses</small>
              </article>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find((item) => item.id === courseId);
  const showToast = useToast();

  if (!course) return <NotFoundPage />;

  const related = courses.filter((item) => item.category === course.category && item.id !== course.id).slice(0, 3);

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <div className="course-detail-hero">
          <Reveal className="course-detail-copy">
            <Link className="back-link" to="/courses">
              <ChevronRight size={16} />
              Back to Courses
            </Link>
            <span className="section-kicker">{course.subject} - {course.level}</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="detail-actions">
              <button className="pill-button large" type="button" onClick={() => showToast(`Enrolled in ${course.title}.`)}>
                Continue Course
                <ArrowRight size={16} />
              </button>
              <button className="outline-button large" type="button" onClick={() => showToast("Course saved to your dashboard.")}>
                Save
              </button>
            </div>
          </Reveal>
          <Reveal delay={120} direction="right">
            <div className="detail-media">
              <img src={course.image} alt="" />
              <button type="button" onClick={() => showToast("Lesson preview queued.")}>
                <Play size={20} fill="currentColor" />
              </button>
            </div>
          </Reveal>
        </div>
        <div className="detail-grid">
          <Reveal>
            <article className="detail-panel">
              <h2>Course Outcomes</h2>
              <div className="outcome-grid">
                {course.outcomes.map((outcome) => (
                  <span key={outcome}>
                    <CheckCircle2 size={17} />
                    {outcome}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="detail-panel instructor-panel">
              <img src={course.avatar} alt="" />
              <div>
                <span className="section-kicker">Instructor</span>
                <h2>{course.instructor}</h2>
                <p>{course.lessons} lessons - {course.duration} - Rated {course.rating}</p>
              </div>
            </article>
          </Reveal>
          <Reveal delay={140} className="wide-panel">
            <article className="detail-panel curriculum-panel">
              <h2>Curriculum Preview</h2>
              {["Foundations", "Core Concepts", "Guided Practice", "Capstone Challenge"].map((unit, index) => (
                <div className="curriculum-row" key={unit}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{unit}</strong>
                  <small>{8 + index * 3} lessons</small>
                </div>
              ))}
            </article>
          </Reveal>
        </div>
        {related.length > 0 && (
          <section className="subsection">
            <Reveal>
              <SectionHeading kicker="Next" title="Related Courses" />
            </Reveal>
            <CourseGrid coursesToShow={related} />
          </section>
        )}
      </div>
    </section>
  );
}

function PageHero({ kicker, title, copy, visual }: { kicker: string; title: string; copy: string; visual: React.ReactNode }) {
  return (
    <div className="page-hero">
      <Reveal className="page-hero-copy">
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </Reveal>
      <Parallax speed={0.1} className="page-hero-visual">
        <Reveal delay={120}>
          {visual}
        </Reveal>
      </Parallax>
    </div>
  );
}
