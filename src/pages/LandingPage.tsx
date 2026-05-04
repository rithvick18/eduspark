import { Link } from "react-router-dom";
import { ArrowRight, Zap, BookOpen, Users, Award } from "lucide-react";
import { Reveal } from "../components/Reveal";

export function LandingPage() {
  return (
    <section className="page-section landing-page">
      <div className="landing-shell">
        <Reveal>
          <div className="landing-brand">
            <span className="landing-logo">
              <Zap size={48} fill="currentColor" />
            </span>
            <h1 className="landing-title">
              Edu<span>Spark</span>
            </h1>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="landing-tagline">
            Learn Without Limits
          </p>
        </Reveal>

        <Reveal delay={250}>
          <p className="landing-description">
            Master any subject with interactive lessons, practice exercises, and expert guidance. 
            Free, focused, and built for momentum.
          </p>
        </Reveal>

        <Reveal delay={350}>
          <div className="landing-features">
            <div className="landing-feature">
              <BookOpen size={24} />
              <span>100+ Courses</span>
            </div>
            <div className="landing-feature">
              <Users size={24} />
              <span>50K+ Learners</span>
            </div>
            <div className="landing-feature">
              <Award size={24} />
              <span>Free Forever</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={450}>
          <div className="landing-actions">
            <Link className="pill-button large" to="/login">
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
