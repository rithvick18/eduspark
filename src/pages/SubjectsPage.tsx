import { useParams } from "react-router-dom";
import { Zap } from "lucide-react";
import { subjects, courses } from "../data";
import { Reveal, Parallax, StaggerContainer, StaggerItem } from "../components/Reveal";
import { SectionHeading, SubjectGrid, CourseGrid, NotFoundPage } from "../components/Shared";

export function SubjectsPage() {
  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Subjects"
          title="A Map for Every Curiosity"
          copy="Move from foundational lessons to advanced tracks with mastery indicators, focused practice, and subject-specific milestones."
          visual={<SubjectsVisual />}
        />
        <Reveal>
          <SectionHeading kicker="Explore" title="Subject Library" />
        </Reveal>
        <SubjectGrid subjectsToShow={subjects} />
      </div>
    </section>
  );
}

function SubjectsVisual() {
  return (
    <div className="subject-orbit">
      {subjects.slice(0, 6).map((subject, index) => {
        const Icon = subject.icon;
        return (
          <span className={`orbit-node node-${index + 1}`} style={{ "--accent": subject.accent } as React.CSSProperties} key={subject.slug}>
            <Icon size={24} />
          </span>
        );
      })}
      <div className="orbit-core">
        <Zap size={28} fill="currentColor" />
        <strong>150+</strong>
        <small>subjects</small>
      </div>
    </div>
  );
}

export function SubjectDetailPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>();
  const subject = subjects.find((item) => item.slug === subjectSlug);

  if (!subject) return <NotFoundPage />;

  const Icon = subject.icon;
  const subjectCourses = courses.filter((course) => course.subjectSlug === subject.slug);

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <div className="subject-detail-hero" style={{ "--accent": subject.accent, "--tint": subject.tint } as React.CSSProperties}>
          <Reveal>
            <span className="subject-detail-icon">
              <Icon size={42} />
            </span>
          </Reveal>
          <Reveal delay={80}>
            <span className="section-kicker">{subject.lessons} lessons</span>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
          </Reveal>
          <Reveal delay={140}>
            <div className="subject-mastery">
              <div className="progress-row">
                <span className="progress-track">
                  <span style={{ width: `${subject.progress}%`, background: subject.accent }} />
                </span>
                <small>{subject.progress > 0 ? `${subject.progress}% mastery` : "New track"}</small>
              </div>
            </div>
          </Reveal>
        </div>

        <section className="subsection">
          <Reveal>
            <SectionHeading kicker="Tracks" title={`${subject.shortName} Learning Tracks`} />
          </Reveal>
          <StaggerContainer className="track-grid" staggerDelay={0.07}>
            {subject.tracks.map((track, index) => (
              <StaggerItem key={track}>
                <article className="track-card" style={{ "--accent": subject.accent } as React.CSSProperties}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{track}</h3>
                  <p>Guided lessons, practice checks, and a mastery challenge.</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <section className="subsection">
          <Reveal>
            <SectionHeading kicker="Courses" title={`Featured in ${subject.name}`} />
          </Reveal>
          {subjectCourses.length > 0 ? <CourseGrid coursesToShow={subjectCourses} /> : <EmptyCourses subject={subject} />}
        </section>
      </div>
    </section>
  );
}

function EmptyCourses({ subject }: { subject: { name: string } }) {
  return (
    <Reveal>
      <div className="empty-panel">
        <h3>{subject.name} courses are being curated.</h3>
        <p>Start with the subject tracks while the course library expands.</p>
      </div>
    </Reveal>
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
