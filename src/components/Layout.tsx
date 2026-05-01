import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
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
import { HomePage } from "../pages/HomePage";
import { CoursesPage, CourseDetailPage } from "../pages/CoursesPage";
import { SubjectsPage, SubjectDetailPage } from "../pages/SubjectsPage";
import { PracticePage } from "../pages/PracticePage";
import { CommunityPage } from "../pages/CommunityPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "./Shared";

const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Subjects", to: "/subjects" },
  { label: "Practice", to: "/practice" },
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
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
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
          {navItems.map((item) => (
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
      <Navbar onSearch={() => setSearchOpen(true)} />
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
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectSlug" element={<SubjectDetailPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
