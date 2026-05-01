import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play
} from "lucide-react";
import { courses, learningPaths } from "../data";
import type { Course } from "../types";
import { useToast } from "../contexts/ToastContext";
import { Reveal, Parallax, StaggerContainer, StaggerItem } from "../components/Reveal";
import { SectionHeading, CourseGrid, NotFoundPage } from "../components/Shared";

export function CoursesPage() {
  const [category, setCategory] = useState("all");
  const categories = ["all", "math", "science", "coding", "economics", "history"];
  const filteredCourses = category === "all" ? courses : courses.filter((course) => course.category === category);

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
        <CourseGrid coursesToShow={filteredCourses} />
        <LearningPaths />
      </div>
    </section>
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
