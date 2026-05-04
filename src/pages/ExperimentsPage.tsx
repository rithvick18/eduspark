import { useState, useEffect, useRef } from "react";
import {
  Atom,
  Battery,
  Beaker,
  ChevronRight,
  Droplet,
  Eye,
  FlaskConical,
  Flame,
  Lightbulb,
  Magnet,
  Microscope,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sun,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Shared";

/* ── Experiment Data ── */
const experiments = [
  {
    id: "photosynthesis",
    title: "Photosynthesis Simulation",
    subject: "Biology",
    chapter: "Life Processes",
    icon: Sun,
    accent: "#4ade80",
    description: "Watch how plants convert CO₂ and water into glucose using sunlight",
    difficulty: "Easy",
    duration: "5 min",
    category: "biology",
  },
  {
    id: "light-refraction",
    title: "Light Refraction Through Prism",
    subject: "Physics",
    chapter: "Light",
    icon: Sparkles,
    accent: "#c084fc",
    description: "Split white light into a spectrum using a virtual glass prism",
    difficulty: "Medium",
    duration: "8 min",
    category: "physics",
  },
  {
    id: "acid-base",
    title: "Acid-Base Titration",
    subject: "Chemistry",
    chapter: "Acids, Bases and Salts",
    icon: FlaskConical,
    accent: "#60a5fa",
    description: "Perform a virtual titration to find the strength of an acid",
    difficulty: "Medium",
    duration: "10 min",
    category: "chemistry",
  },
  {
    id: "electric-circuit",
    title: "Electric Circuit Builder",
    subject: "Physics",
    chapter: "Electricity",
    icon: Zap,
    accent: "#fbbf24",
    description: "Build circuits with resistors, batteries, and bulbs virtually",
    difficulty: "Easy",
    duration: "12 min",
    category: "physics",
  },
  {
    id: "cell-division",
    title: "Mitosis & Meiosis Viewer",
    subject: "Biology",
    chapter: "Heredity",
    icon: Microscope,
    accent: "#f472b6",
    description: "Watch cell division unfold in real-time animation",
    difficulty: "Medium",
    duration: "7 min",
    category: "biology",
  },
  {
    id: "magnetic-field",
    title: "Magnetic Field Lines",
    subject: "Physics",
    chapter: "Magnetic Effects",
    icon: Magnet,
    accent: "#f87171",
    description: "Visualize magnetic field patterns around different magnets",
    difficulty: "Easy",
    duration: "6 min",
    category: "physics",
  },
  {
    id: "chemical-reactions",
    title: "Reaction Simulator",
    subject: "Chemistry",
    chapter: "Chemical Reactions",
    icon: Beaker,
    accent: "#2dd4bf",
    description: "Mix virtual chemicals and observe reaction types",
    difficulty: "Hard",
    duration: "15 min",
    category: "chemistry",
  },
  {
    id: "sound-waves",
    title: "Sound Wave Visualizer",
    subject: "Physics",
    chapter: "Sound",
    icon: Waves,
    accent: "#818cf8",
    description: "See how frequency and amplitude affect sound waves",
    difficulty: "Easy",
    duration: "5 min",
    category: "physics",
  },
];

/* ── Interactive Experiment Visualizations ── */

function PhotosynthesisViz() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= 4) {
          setRunning(false);
          return 4;
        }
        return s + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [running]);

  const steps = [
    { label: "Sunlight absorbed by chlorophyll", color: "#fbbf24" },
    { label: "Water (H₂O) splits into H⁺ and O₂", color: "#60a5fa" },
    { label: "CO₂ enters through stomata", color: "#94a3b8" },
    { label: "Calvin Cycle produces glucose (C₆H₁₂O₆)", color: "#4ade80" },
    { label: "Oxygen released as byproduct!", color: "#4ade80" },
  ];

  return (
    <div className="exp-viz photosynthesis-viz">
      <div className="exp-viz-canvas">
        {/* Sun */}
        <div className={`photosynthesis-sun ${step >= 0 && running ? "active" : ""}`}>
          <Sun size={42} />
          <div className="sun-rays">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} style={{ transform: `rotate(${i * 45}deg)` }} />
            ))}
          </div>
        </div>

        {/* Leaf */}
        <div className={`photosynthesis-leaf step-${step}`}>
          <div className="leaf-body">
            <div className="leaf-veins">
              <span /><span /><span />
            </div>
            <div className="chloroplasts">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={`chloroplast ${step >= 1 ? "active" : ""}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Particles */}
        <div className="photosynthesis-particles">
          {step >= 1 && (
            <div className="particle water-particle">
              <Droplet size={14} />
              <span>H₂O</span>
            </div>
          )}
          {step >= 2 && (
            <div className="particle co2-particle">
              <Wind size={14} />
              <span>CO₂</span>
            </div>
          )}
          {step >= 3 && (
            <div className="particle glucose-particle">
              <Sparkles size={14} />
              <span>C₆H₁₂O₆</span>
            </div>
          )}
          {step >= 4 && (
            <div className="particle o2-particle">
              <span>O₂ ↑</span>
            </div>
          )}
        </div>
      </div>

      <div className="exp-viz-steps">
        {steps.map((s, i) => (
          <div key={i} className={`exp-step ${i <= step ? "active" : ""} ${i === step ? "current" : ""}`}>
            <span className="exp-step-dot" style={{ background: i <= step ? s.color : undefined }} />
            <span className="exp-step-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="exp-controls">
        <button
          className="pill-button small"
          type="button"
          onClick={() => { setStep(0); setRunning(true); }}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "Running..." : "Start Experiment"}
        </button>
        <button className="outline-button" type="button" onClick={() => { setStep(0); setRunning(false); }}>
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}

function PrismViz() {
  const [angle, setAngle] = useState(45);
  const colors = ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];
  const labels = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];

  return (
    <div className="exp-viz prism-viz">
      <div className="prism-canvas">
        {/* Incoming white light */}
        <div className="prism-incoming-light" />

        {/* Prism */}
        <div className="prism-shape" style={{ transform: `rotate(${angle - 45}deg)` }}>
          <div className="prism-face prism-face-1" />
          <div className="prism-face prism-face-2" />
          <div className="prism-face prism-face-3" />
        </div>

        {/* Spectrum */}
        <div className="prism-spectrum">
          {colors.map((color, i) => (
            <div
              key={i}
              className="spectrum-ray"
              style={{
                background: color,
                transform: `rotate(${(i - 3) * (angle / 15)}deg)`,
                opacity: 0.8,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Spectrum labels */}
        <div className="spectrum-labels">
          {labels.map((label, i) => (
            <span key={i} style={{ color: colors[i] }}>{label}</span>
          ))}
        </div>
      </div>

      <div className="exp-slider">
        <label>
          <span>Prism Angle: {angle}°</span>
          <input
            type="range"
            min={20}
            max={70}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

function CircuitViz() {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(3);
  const current = (voltage / resistance).toFixed(2);
  const brightness = Math.min(100, (voltage / resistance) * 10);

  return (
    <div className="exp-viz circuit-viz">
      <div className="circuit-canvas">
        <div className="circuit-wire circuit-wire-top" />
        <div className="circuit-wire circuit-wire-bottom" />
        <div className="circuit-wire circuit-wire-left" />
        <div className="circuit-wire circuit-wire-right" />

        <div className="circuit-battery">
          <Battery size={28} />
          <span>{voltage}V</span>
        </div>

        <div className="circuit-resistor">
          <div className="resistor-body">
            <span className="resistor-band" style={{ background: "#a855f7" }} />
            <span className="resistor-band" style={{ background: "#ef4444" }} />
            <span className="resistor-band" style={{ background: "#f59e0b" }} />
          </div>
          <span>{resistance}Ω</span>
        </div>

        <div className="circuit-bulb" style={{ "--brightness": brightness } as React.CSSProperties}>
          <Lightbulb size={28} />
          <div className="bulb-glow" />
        </div>

        {/* Current arrows */}
        <div className="current-flow">
          <span className="current-arrow" />
          <span className="current-arrow" />
          <span className="current-arrow" />
        </div>
      </div>

      <div className="circuit-readout">
        <div className="readout-item">
          <span className="readout-label">Voltage (V)</span>
          <span className="readout-value">{voltage} V</span>
        </div>
        <div className="readout-item">
          <span className="readout-label">Resistance (R)</span>
          <span className="readout-value">{resistance} Ω</span>
        </div>
        <div className="readout-item highlight">
          <span className="readout-label">Current (I = V/R)</span>
          <span className="readout-value">{current} A</span>
        </div>
      </div>

      <div className="exp-slider-row">
        <label>
          <span>Voltage: {voltage}V</span>
          <input type="range" min={1} max={24} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
        </label>
        <label>
          <span>Resistance: {resistance}Ω</span>
          <input type="range" min={1} max={20} value={resistance} onChange={(e) => setResistance(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}

/* ── Experiment Card and Browser ── */

function ExperimentCard({ exp, onSelect }: { exp: typeof experiments[0]; onSelect: () => void }) {
  const Icon = exp.icon;

  return (
    <div
      className="experiment-card"
      style={{ "--accent": exp.accent } as React.CSSProperties}
      onClick={onSelect}
    >
      <div className="exp-card-visual">
        <div className="exp-card-glow" />
        <Icon size={36} />
      </div>
      <div className="exp-card-body">
        <div className="exp-card-badges">
          <span className="exp-badge subject">{exp.subject}</span>
          <span className="exp-badge difficulty">{exp.difficulty}</span>
        </div>
        <h3>{exp.title}</h3>
        <p>{exp.description}</p>
        <div className="exp-card-footer">
          <span className="exp-duration">
            <Play size={12} />
            {exp.duration}
          </span>
          <span className="exp-card-action">
            Start Lab <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

function ExperimentViewer({ experiment }: { experiment: typeof experiments[0] }) {
  const vizMap: Record<string, React.ReactNode> = {
    photosynthesis: <PhotosynthesisViz />,
    "light-refraction": <PrismViz />,
    "electric-circuit": <CircuitViz />,
  };

  const viz = vizMap[experiment.id] || (
    <div className="exp-placeholder-viz">
      <div className="exp-placeholder-icon" style={{ "--accent": experiment.accent } as React.CSSProperties}>
        {(() => { const Icon = experiment.icon; return <Icon size={48} />; })()}
      </div>
      <h3>{experiment.title}</h3>
      <p>Interactive simulation coming soon!</p>
      <div className="exp-placeholder-particles">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="exp-floating-particle" style={{ animationDelay: `${i * 0.3}s`, left: `${10 + Math.random() * 80}%` }} />
        ))}
      </div>
    </div>
  );

  return (
    <Reveal>
      <div className="experiment-viewer" style={{ "--accent": experiment.accent } as React.CSSProperties}>
        <div className="ev-header">
          <div className="ev-subject-badge" style={{ background: experiment.accent }}>
            {experiment.subject}
          </div>
          <div>
            <h2>{experiment.title}</h2>
            <p>{experiment.chapter} • {experiment.difficulty} • {experiment.duration}</p>
          </div>
        </div>
        {viz}
      </div>
    </Reveal>
  );
}

function ExperimentsHeroVisual() {
  return (
    <div className="experiments-hero-visual">
      <div className="ehv-flask">
        <FlaskConical size={48} />
        <div className="ehv-bubbles">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="ehv-bubble" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>
      </div>
      <div className="ehv-atoms">
        <div className="ehv-atom ehv-atom-1">
          <Atom size={24} />
        </div>
        <div className="ehv-atom ehv-atom-2">
          <Sparkles size={20} />
        </div>
        <div className="ehv-atom ehv-atom-3">
          <Zap size={18} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function ExperimentsPage() {
  const [selectedExp, setSelectedExp] = useState<typeof experiments[0] | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? experiments : experiments.filter((e) => e.category === filter);

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Virtual Lab"
          title="Interactive Experiments"
          copy="Explore stunning interactive science simulations. Build circuits, split light through prisms, watch photosynthesis unfold, and more."
          visual={<ExperimentsHeroVisual />}
        />

        {selectedExp && (
          <>
            <ExperimentViewer experiment={selectedExp} />
            <button
              className="outline-button"
              type="button"
              onClick={() => setSelectedExp(null)}
              style={{ marginBottom: 40 }}
            >
              ← Back to All Experiments
            </button>
          </>
        )}

        <div className="section-heading">
          <div>
            <span className="section-kicker">Browse</span>
            <h2 className="section-title">All Experiments</h2>
          </div>
          <div className="tabs" role="tablist">
            {[
              ["all", "All"],
              ["physics", "Physics"],
              ["chemistry", "Chemistry"],
              ["biology", "Biology"],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`tab ${filter === val ? "active" : ""}`}
                type="button"
                onClick={() => setFilter(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <StaggerContainer className="experiments-grid" staggerDelay={0.07}>
          {filtered.map((exp) => (
            <StaggerItem key={exp.id}>
              <ExperimentCard exp={exp} onSelect={() => setSelectedExp(exp)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
