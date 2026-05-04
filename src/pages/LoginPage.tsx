import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpenCheck, GraduationCap, LockKeyhole, Mail, School, UserPlus } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";

interface FormState {
  name: string;
  email: string;
  password: string;
  grade: string;
  school: string;
  learningGoal: string;
}

export function LoginPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    grade: "",
    school: "",
    learningGoal: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const { user, isConfigured, signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user) navigate("/courses");
  }, [navigate, user]);

  const updateField = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = form.email.trim();

    const needsStudentDetails =
      mode === "signup" &&
      (!form.name.trim() || !form.grade.trim() || !form.school.trim() || !form.learningGoal.trim());

    if (!email || !form.password.trim() || needsStudentDetails) {
      showToast("Fill in the required fields to continue.");
      return;
    }

    setLoading(true);
    const { error, data } =
      mode === "signup"
        ? await signUpWithEmail({
            name: form.name.trim(),
            email,
            password: form.password,
            grade: form.grade,
            school: form.school.trim(),
            learningGoal: form.learningGoal
          })
        : await signInWithEmail({ email, password: form.password });
    setLoading(false);

    if (error) {
      showToast(error.message);
      return;
    }

    if (mode === "signup" && data && !data.session) {
      showToast("Check your email to confirm your EduSpark account.");
      return;
    }

    showToast(mode === "signup" ? "Your EduSpark account is ready." : "Welcome back.");
    navigate("/courses");
  };

  const continueWithGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) showToast(error.message);
  };

  return (
    <section className="page-section top-page login-page">
      <div className="content-shell login-shell">
        <div className="login-copy">
          <span className="section-kicker">Account</span>
          <h1>Your Study Space Starts Here</h1>
          <p>
            Create a student profile, save your courses, and keep your practice history synced across
            every session.
          </p>
          <div className="login-proof-grid">
            {[
              ["1", "student profile"],
              ["24/7", "course access"],
              ["100%", "progress synced"]
            ].map(([value, label]) => (
              <div className="login-proof" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <article className="auth-card">
          {!isConfigured && (
            <div className="auth-alert">
              Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in a local
              <code>.env</code> file to enable Supabase Auth.
            </div>
          )}

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => setMode("signup")}>
              Sign Up
            </button>
            <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
              Log In
            </button>
          </div>

          <button className="google-button" type="button" onClick={continueWithGoogle} disabled={loading}>
            <span aria-hidden="true">G</span>
            {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </button>

          <div className="auth-divider">
            <span />
            <small>or use email</small>
            <span />
          </div>

          <form className="auth-form" onSubmit={submitEmail}>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Full name</span>
                <div>
                  <UserPlus size={17} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Riya Sharma"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            {mode === "signup" && (
              <div className="student-detail-grid">
                <label className="auth-field">
                  <span>Class / grade</span>
                  <div>
                    <GraduationCap size={17} />
                    <select name="grade" value={form.grade} onChange={updateField}>
                      <option value="">Select grade</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                      <option value="College">College</option>
                    </select>
                  </div>
                </label>

                <label className="auth-field">
                  <span>Learning goal</span>
                  <div>
                    <BookOpenCheck size={17} />
                    <select name="learningGoal" value={form.learningGoal} onChange={updateField}>
                      <option value="">Choose goal</option>
                      <option value="Homework help">Homework help</option>
                      <option value="Exam preparation">Exam preparation</option>
                      <option value="Skill building">Skill building</option>
                      <option value="Competitive exams">Competitive exams</option>
                    </select>
                  </div>
                </label>
              </div>
            )}

            {mode === "signup" && (
              <label className="auth-field">
                <span>School / college</span>
                <div>
                  <School size={17} />
                  <input
                    name="school"
                    value={form.school}
                    onChange={updateField}
                    placeholder="Delhi Public School"
                    autoComplete="organization"
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>
              <div>
                <Mail size={17} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div>
                <LockKeyhole size={17} />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
            </label>

            <div className="auth-options">
              <label>
                <input type="checkbox" defaultChecked />
                Keep me signed in
              </label>
              {mode === "login" && <button type="button">Forgot password?</button>}
            </div>

            <button className="pill-button large auth-submit" type="submit" disabled={loading}>
              {loading ? "Working..." : mode === "signup" ? "Create Free Account" : "Log In"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-footnote">
            {mode === "signup" ? "Already learning here?" : "New to EduSpark?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
              {mode === "signup" ? "Log in instead" : "Create an account"}
            </button>
          </p>
        </article>
      </div>
    </section>
  );
}
