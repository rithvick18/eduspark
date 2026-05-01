import { Link } from "react-router-dom";
import {
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Zap
} from "lucide-react";

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" to="/" aria-label="EduSpark home">
      <span className="brand-icon">
        <Zap size={compact ? 16 : 20} fill="currentColor" />
      </span>
      <span className="brand-text">
        Edu<span>Spark</span>
      </span>
    </Link>
  );
}

export function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      {links.map(([label, to]) => (
        <Link to={to} key={label}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandMark compact />
            <p>Free, world-class education for anyone, anywhere.</p>
            <div className="social-row">
              <a href="/" aria-label="Twitter"><Twitter size={15} /></a>
              <a href="/" aria-label="YouTube"><Youtube size={15} /></a>
              <a href="/" aria-label="Instagram"><Instagram size={15} /></a>
              <a href="/" aria-label="LinkedIn"><Linkedin size={15} /></a>
            </div>
          </div>
          <FooterColumn
            title="Subjects"
            links={[
              ["Mathematics", "/subjects/mathematics"],
              ["Science", "/subjects/science"],
              ["Computing", "/subjects/computing"],
              ["Economics", "/subjects/economics"],
              ["Arts & Humanities", "/subjects/arts-humanities"]
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              ["For Teachers", "/community"],
              ["For Parents", "/subjects"],
              ["Test Prep", "/subjects/test-prep"],
              ["Practice", "/practice"],
              ["Courses", "/courses"]
            ]}
          />
          <FooterColumn
            title="About"
            links={[
              ["Our Mission", "/"],
              ["Our Team", "/community"],
              ["Press", "/community"],
              ["Donate", "/"],
              ["Contact", "/community"]
            ]}
          />
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 EduSpark. All rights reserved. Free education for all.</p>
          <div>
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
