import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Gamepad2,
  Globe,
  LogOut,
  Menu,
  Search,
  X,
  Zap
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Parallax } from "./Reveal";
import { subjects, courses, searchBoosts } from "../data";
import type { NavItem, SearchItem } from "../types";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { Footer } from "./Footer";
import { FloatingChatbot } from "./FloatingChatbot";
import { LandingPage } from "../pages/LandingPage";
import { HomePage } from "../pages/HomePage";
import { CoursesPage, CourseDetailPage } from "../pages/CoursesPage";
import { SubjectsPage, SubjectDetailPage } from "../pages/SubjectsPage";
import { PracticePage } from "../pages/PracticePage";
import { CommunityPage } from "../pages/CommunityPage";
import { LoginPage } from "../pages/LoginPage";
import { GamifiedLearningPage } from "../pages/GamifiedLearningPage";
import { StudentAnalysisPage } from "../pages/StudentAnalysisPage";
import { QuestionPaperPage } from "../pages/QuestionPaperPage";
import { MarkGraderPage } from "../pages/MarkGraderPage";
import { ExperimentsPage } from "../pages/ExperimentsPage";
import { MapsPage } from "../pages/MapsPage";
import { NotFoundPage } from "./Shared";

const topNavItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Subjects", to: "/subjects" },
  { label: "Community", to: "/community" }
];

const practiceDropdownItems = [
  { label: "Practice Quizzes", to: "/practice", icon: Zap },
  { label: "Gamified Learning", to: "/gamified", icon: Gamepad2 },
  { label: "Student Analysis", to: "/analysis", icon: BarChart3 },
  { label: "Question Papers", to: "/papers", icon: FileText },
  { label: "Mark Grader", to: "/grader", icon: ClipboardCheck },
  { label: "Experiments", to: "/experiments", icon: FlaskConical },
  { label: "Maps", to: "/maps", icon: Globe },
];

const allMobileItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Subjects", to: "/subjects" },
  { label: "Practice", to: "/practice" },
  { label: "Gamified", to: "/gamified" },
  { label: "Analysis", to: "/analysis" },
  { label: "Papers", to: "/papers" },
  { label: "Grader", to: "/grader" },
  { label: "Experiments", to: "/experiments" },
  { label: "Maps", to: "/maps" },
  { label: "Community", to: "/community" }
];

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function GlobalBackground() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="ambient" aria-hidden="true">
        <Parallax speed={0.05}>
          <div className="ambient-blob ambient-blob-one" />
        </Parallax>
        <Parallax speed={0.08}>
          <div className="ambient-blob ambient-blob-two" />
        </Parallax>
        <Parallax speed={0.03}>
          <div className="ambient-blob ambient-blob-three" />
        </Parallax>
      </div>
    </>
  );
}

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

function PracticeDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isActive = practiceDropdownItems.some((item) => location.pathname === item.to);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="nav-dropdown-wrap" ref={ref}>
      <button
        className={`nav-link nav-dropdown-trigger ${isActive ? "active" : ""}`}
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        Practice
        <ChevronDown size={13} className={`nav-dd-chevron ${open ? "rotated" : ""}`} />
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          {practiceDropdownItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                className={({ isActive: a }) => `nav-dropdown-item ${a ? "active" : ""}`}
                to={item.to}
              >
                <span className="nav-dd-icon"><Icon size={15} /></span>
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Navbar({ onSearch }: { onSearch: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const showToast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label="Primary navigation">
        <BrandMark />
        <div className="desktop-nav">
          {topNavItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          <PracticeDropdown />
        </div>
        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={onSearch} aria-label="Search">
            <Search size={16} />
          </button>
          {user ? (
            <div className="nav-user">
              <span className="hide-small">{user.email}</span>
              <button
                className="icon-button"
                type="button"
                onClick={async () => {
                  const { error } = await signOut();
                  if (error) showToast(error.message);
                  navigate("/");
                }}
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link className="text-button hide-small" to="/login">
                Sign In
              </Link>
              <Link className="pill-button small" to="/login" onClick={() => showToast("Create your free EduSpark account.")}>
                Get Started
              </Link>
            </>
          )}
          <button
            className="icon-button mobile-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {allMobileItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const items = useMemo(() => {
    const all: SearchItem[] = [
      ...subjects.map((subject) => ({
        title: subject.name,
        eyebrow: `${subject.lessons} lessons`,
        Icon: subject.icon,
        accent: subject.accent,
        to: `/subjects/${subject.slug}`
      })),
      ...courses.map((course) => ({
        title: course.title,
        eyebrow: `${course.subject} - ${course.level}`,
        Icon: course.icon,
        accent: course.accent,
        to: `/courses/${course.id}`
      })),
      ...searchBoosts.map((item) => ({
        title: item.title,
        eyebrow: "Quick access",
        Icon: item.icon,
        accent: "#ffd400",
        to: item.to
      }))
    ];

    if (!query.trim()) return all.slice(0, 8);
    return all
      .filter((item) => `${item.title} ${item.eyebrow}`.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }, [query]);

  const openItem = (item: SearchItem) => {
    navigate(item.to);
    showToast(`Opening ${item.title}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-layer search-layer" role="dialog" aria-modal="true" aria-label="Search">
      <button className="modal-backdrop" type="button" onClick={onClose} aria-label="Close search" />
      <div className="search-modal">
        <div className="search-input-row">
          <Search size={20} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses, subjects, or topics..."
          />
          <button className="keyboard-chip" type="button" onClick={onClose}>
            ESC
          </button>
        </div>
        <div className="search-results">
          <p className="section-kicker">{query.trim() ? "Results" : "Quick Access"}</p>
          {items.length > 0 ? (
            items.map((item) => {
              const Icon = item.Icon;
              return (
                <button className="search-result" key={`${item.to}-${item.title}`} type="button" onClick={() => openItem(item)}>
                  <span className="search-result-icon" style={{ "--accent": item.accent } as React.CSSProperties}>
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.eyebrow}</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              );
            })
          ) : (
            <div className="empty-state">No results found for "{query}".</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <ScrollToTop />
      <GlobalBackground />
      {!isLanding && <Navbar onSearch={() => setSearchOpen(true)} />}
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectSlug" element={<SubjectDetailPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/gamified" element={<GamifiedLearningPage />} />
              <Route path="/analysis" element={<StudentAnalysisPage />} />
              <Route path="/papers" element={<QuestionPaperPage />} />
              <Route path="/grader" element={<MarkGraderPage />} />
              <Route path="/experiments" element={<ExperimentsPage />} />
              <Route path="/maps" element={<MapsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isLanding && <Footer />}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <FloatingChatbot />
    </>
  );
}
