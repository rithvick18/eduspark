import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Flame, Play, Star } from "lucide-react";
import { stats, courses, subjects, leaderboard, testimonials } from "../data";
import type { Course, Subject, Stat } from "../types";
import { useToast } from "../contexts/ToastContext";
import { Reveal, Parallax, StaggerContainer, StaggerItem } from "./Reveal";

export function SectionHeading({ kicker, title, action }: { kicker: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatsRow() {
  return (
    <div className="stats-row">
      {stats.map((stat: Stat, index: number) => (
        <div className="stat-group" key={stat.label}>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
          {index < stats.length - 1 && <span className="stat-divider" />}
        </div>
      ))}
    </div>
  );
}

export function SubjectGrid({ subjectsToShow }: { subjectsToShow: Subject[] }) {
  const showToast = useToast();

  return (
    <StaggerContainer className="subject-grid" staggerDelay={0.06}>
      {subjectsToShow.map((subject) => {
        const Icon = subject.icon;
        return (
          <StaggerItem key={subject.slug}>
            <Link
              className="subject-card"
              to={`/subjects/${subject.slug}`}
              onClick={() => showToast(`Exploring ${subject.name}`)}
            >
              <span className="subject-icon" style={{ "--accent": subject.accent, "--tint": subject.tint } as React.CSSProperties}>
                <Icon size={25} />
              </span>
              <h3>{subject.name}</h3>
              <p>{subject.lessons} lessons</p>
              <div className="progress-row">
                <span className="progress-track">
                  <span style={{ width: `${subject.progress}%`, background: subject.accent }} />
                </span>
                <small>{subject.progress > 0 ? `${subject.progress}%` : "New"}</small>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

export function CourseGrid({ coursesToShow }: { coursesToShow: Course[] }) {
  return (
    <StaggerContainer className="course-grid" staggerDelay={0.07}>
      {coursesToShow.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}
    </StaggerContainer>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  const showToast = useToast();

  return (
    <StaggerItem>
      <Link className="course-card shine-effect" to={`/courses/${course.id}`} onClick={() => showToast(`Opening ${course.title}`)}>
        <div className="course-media">
          <img src={course.image} alt="" />
          <div className="course-media-overlay" />
          <div className="course-badges">
            <span style={{ "--accent": course.accent, "--tint": course.tint } as React.CSSProperties}>{course.subject}</span>
            <span>{course.level}</span>
          </div>
          <span className="course-play">
            <Play size={17} fill="currentColor" />
          </span>
        </div>
        <div className="course-body">
          <div className="course-title-row">
            <h3>{course.title}</h3>
            <span style={{ "--accent": course.accent, "--tint": course.tint } as React.CSSProperties}>
              <Icon size={16} />
            </span>
          </div>
          <p>{course.description}</p>
          <div className="course-meta">
            <span className="teacher">
              <img src={course.avatar} alt="" />
              {course.instructor}
            </span>
            <span className="rating">
              <Star size={13} fill="currentColor" />
              {course.rating}
            </span>
          </div>
          <div className="progress-row course-progress">
            <span className="progress-track">
              <span style={{ width: `${course.progress}%`, background: course.accent }} />
            </span>
            <small>{course.progress > 0 ? `${course.progress}% complete` : "Not started"}</small>
          </div>
        </div>
      </Link>
    </StaggerItem>
  );
}

export function LeaderboardTable() {
  return (
    <Reveal delay={100}>
      <div className="leaderboard">
        <div className="leaderboard-head">
          <span>#</span>
          <span>Learner</span>
          <span>XP</span>
          <span>Streak</span>
        </div>
        {leaderboard.map((learner) => (
          <div className={`leaderboard-row ${learner.current ? "current" : ""}`} key={learner.name}>
            <span className={`rank rank-${learner.rank}`}>{learner.rank}</span>
            <span className="learner">
              <img src={learner.image} alt="" />
              <span>
                <strong>{learner.name}</strong>
                <small>{learner.level}</small>
              </span>
            </span>
            <span className="xp">{learner.xp}</span>
            <span className="streak">
              <Flame size={15} fill="currentColor" />
              {learner.streak}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function TestimonialsSection() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="marquee-section">
      <div className="center-heading compact-heading">
        <span className="section-kicker">Testimonials</span>
      </div>
      <div className="marquee-track">
        {loop.map((testimonial, index) => (
          <figure className="testimonial-card" key={`${testimonial.name}-${index}`}>
            <div className="stars" aria-label={`${testimonial.rating} star rating`}>
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  size={14}
                  fill="currentColor"
                  className={starIndex < testimonial.rating ? "" : "muted"}
                  key={starIndex}
                />
              ))}
            </div>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <img src={testimonial.image} alt="" />
              <span>
                <strong>{testimonial.name}</strong>
                <small>{testimonial.role}</small>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function PageHero({ kicker, title, copy, visual }: { kicker: string; title: string; copy: string; visual: React.ReactNode }) {
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

export function NotFoundPage() {
  return (
    <section className="page-section top-page">
      <div className="content-shell narrow center-heading">
        <Reveal>
          <span className="section-kicker">404</span>
          <h1 className="section-title">This lesson is off the map</h1>
          <p className="hero-copy">Head back to the course library and pick up the trail from there.</p>
          <Link className="pill-button large" to="/courses">
            Browse Courses
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function CourseDetailOutcomes({ outcomes }: { outcomes: string[] }) {
  return (
    <article className="detail-panel">
      <h2>Course Outcomes</h2>
      <div className="outcome-grid">
        {outcomes.map((outcome) => (
          <span key={outcome}>
            <CheckCircle2 size={17} />
            {outcome}
          </span>
        ))}
      </div>
    </article>
  );
}
