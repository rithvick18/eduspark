import { useState } from "react";
import {
  ChevronRight,
  Globe,
  Landmark,
  Map,
  MapPin,
  Mountain,
  Navigation,
  Ship,
  Sparkles,
  Star,
  Waves,
  Wheat,
  Wind,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Shared";

/* ── Map Data ── */
const indiaRegions = [
  { id: "north", name: "Northern India", label: "N", states: ["J&K", "HP", "Punjab", "Haryana", "UP", "Uttarakhand"], features: ["Himalayas", "Indo-Gangetic Plains", "Thar Desert Edge"], color: "#60a5fa", x: 45, y: 18 },
  { id: "south", name: "Southern India", label: "S", states: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana"], features: ["Western Ghats", "Deccan Plateau", "Coastal Plains"], color: "#4ade80", x: 48, y: 72 },
  { id: "east", name: "Eastern India", label: "E", states: ["West Bengal", "Odisha", "Bihar", "Jharkhand"], features: ["Sundarbans", "Chota Nagpur Plateau", "Mahanadi Delta"], color: "#c084fc", x: 72, y: 45 },
  { id: "west", name: "Western India", label: "W", states: ["Maharashtra", "Gujarat", "Rajasthan", "Goa"], features: ["Arabian Sea Coast", "Thar Desert", "Western Ghats"], color: "#fbbf24", x: 22, y: 48 },
  { id: "northeast", name: "Northeast India", label: "NE", states: ["Assam", "Meghalaya", "Arunachal Pradesh", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"], features: ["Brahmaputra Valley", "Shillong Plateau", "Tropical Forests"], color: "#f472b6", x: 82, y: 25 },
  { id: "central", name: "Central India", label: "C", states: ["Madhya Pradesh", "Chhattisgarh"], features: ["Vindhya Range", "Narmada Valley", "Dense Forests"], color: "#2dd4bf", x: 48, y: 42 },
];

const historicalSites = [
  { name: "Taj Mahal", location: "Agra, UP", period: "Mughal Era (1632)", type: "Monument", x: 52, y: 28, color: "#ffd400" },
  { name: "Hampi Ruins", location: "Karnataka", period: "Vijayanagara (1336)", type: "Archaeological", x: 42, y: 62, color: "#f472b6" },
  { name: "Konark Sun Temple", location: "Odisha", period: "Eastern Ganga (1255)", type: "Temple", x: 68, y: 48, color: "#c084fc" },
  { name: "Qutub Minar", location: "Delhi", period: "Delhi Sultanate (1193)", type: "Tower", x: 48, y: 24, color: "#60a5fa" },
  { name: "Red Fort", location: "Delhi", period: "Mughal Era (1639)", type: "Fort", x: 49, y: 23, color: "#f87171" },
  { name: "Ajanta Caves", location: "Maharashtra", period: "2nd Century BC", type: "Caves", x: 38, y: 48, color: "#4ade80" },
  { name: "Khajuraho", location: "MP", period: "Chandela (950 AD)", type: "Temple Complex", x: 52, y: 38, color: "#fbbf24" },
  { name: "Meenakshi Temple", location: "Tamil Nadu", period: "Nayak (1623)", type: "Temple", x: 50, y: 78, color: "#818cf8" },
];

const physicalFeatures = [
  { name: "Himalayas", type: "Mountain Range", icon: Mountain, desc: "Young fold mountains, highest peaks in the world", x: 48, y: 10, color: "#94a3b8" },
  { name: "Indo-Gangetic Plains", type: "Plains", icon: Wheat, desc: "Alluvial plains, most fertile region in India", x: 50, y: 30, color: "#4ade80" },
  { name: "Thar Desert", type: "Desert", icon: Wind, desc: "Hot desert in western Rajasthan", x: 22, y: 30, color: "#fbbf24" },
  { name: "Western Ghats", type: "Mountain Range", icon: Mountain, desc: "UNESCO biodiversity hotspot along west coast", x: 30, y: 60, color: "#4ade80" },
  { name: "Deccan Plateau", type: "Plateau", icon: Landmark, desc: "Triangular plateau of peninsular India", x: 48, y: 55, color: "#c084fc" },
  { name: "Indian Ocean", type: "Ocean", icon: Waves, desc: "Borders India to the south", x: 48, y: 90, color: "#60a5fa" },
];

/* ── Components ── */

function InteractiveIndiaMap({ mode }: { mode: string }) {
  const showToast = useToast();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof indiaRegions[0] | typeof historicalSites[0] | typeof physicalFeatures[0] | null>(null);
  const [zoom, setZoom] = useState(1);

  const items = mode === "regions" ? indiaRegions : mode === "history" ? historicalSites : physicalFeatures;

  return (
    <div className="interactive-map-container">
      <div className="map-canvas" style={{ transform: `scale(${zoom})` }}>
        {/* India outline (simplified SVG shape) */}
        <svg viewBox="0 0 100 100" className="india-outline">
          <path
            d="M45,5 L55,5 L65,10 L72,15 L80,18 L85,22 L88,28 L85,25 L82,22 L78,25 L82,30 L85,35 L82,40 L78,45 L75,50 L72,55 L68,52 L65,55 L62,60 L60,65 L58,70 L55,75 L52,78 L50,82 L48,85 L50,88 L52,90 L48,92 L45,88 L42,82 L40,78 L38,72 L35,68 L32,65 L28,62 L25,58 L22,52 L20,48 L18,42 L15,38 L18,32 L20,28 L22,25 L25,22 L28,18 L32,15 L35,12 L38,8 L42,6 Z"
            className="india-path"
          />
        </svg>

        {/* Map pins/markers */}
        {items.map((item, idx) => {
          const isRegion = "states" in item;
          const isSite = "period" in item;
          return (
            <button
              key={idx}
              className={`map-pin ${hoveredRegion === ("id" in item ? item.id : item.name) ? "active" : ""}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                "--pin-color": item.color,
              } as React.CSSProperties}
              type="button"
              onMouseEnter={() => setHoveredRegion("id" in item ? item.id : item.name)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => {
                setSelectedItem(item);
                showToast(`Viewing: ${item.name}`);
              }}
            >
              <MapPin size={18} />
              <span className="pin-label">{isRegion ? (item as typeof indiaRegions[0]).label : item.name.split(" ")[0]}</span>
            </button>
          );
        })}

        {/* Hover tooltip */}
        {hoveredRegion && (
          <div className="map-tooltip">
            {items.find((i) => ("id" in i ? i.id : i.name) === hoveredRegion)?.name}
          </div>
        )}
      </div>

      {/* Zoom controls */}
      <div className="map-zoom-controls">
        <button type="button" onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}>
          <ZoomIn size={16} />
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}>
          <ZoomOut size={16} />
        </button>
      </div>

      {/* Selected item detail */}
      {selectedItem && (
        <div className="map-detail-panel" style={{ "--accent": selectedItem.color } as React.CSSProperties}>
          <button className="map-detail-close" type="button" onClick={() => setSelectedItem(null)}>×</button>
          <h3>{selectedItem.name}</h3>
          {"states" in selectedItem && (
            <>
              <div className="map-detail-tags">
                {(selectedItem as typeof indiaRegions[0]).states.map((s) => (
                  <span key={s} className="map-tag">{s}</span>
                ))}
              </div>
              <h4>Key Features</h4>
              <ul>
                {(selectedItem as typeof indiaRegions[0]).features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}
          {"period" in selectedItem && (
            <>
              <p className="map-detail-meta">{(selectedItem as typeof historicalSites[0]).location} • {(selectedItem as typeof historicalSites[0]).period}</p>
              <span className="map-tag">{(selectedItem as typeof historicalSites[0]).type}</span>
            </>
          )}
          {"desc" in selectedItem && (
            <>
              <p>{(selectedItem as typeof physicalFeatures[0]).desc}</p>
              <span className="map-tag">{(selectedItem as typeof physicalFeatures[0]).type}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MapModeSelector({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const modes = [
    { id: "regions", label: "Regions", icon: Globe, desc: "Explore India's geographic regions" },
    { id: "history", label: "Historical Sites", icon: Landmark, desc: "Major historical monuments" },
    { id: "physical", label: "Physical Features", icon: Mountain, desc: "Mountains, rivers, and terrain" },
  ];

  return (
    <div className="map-mode-selector">
      {modes.map((m) => {
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            className={`map-mode-btn ${mode === m.id ? "active" : ""}`}
            type="button"
            onClick={() => setMode(m.id)}
          >
            <Icon size={18} />
            <div>
              <strong>{m.label}</strong>
              <small>{m.desc}</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MapLegend({ mode }: { mode: string }) {
  const items = mode === "regions" ? indiaRegions : mode === "history" ? historicalSites : physicalFeatures;

  return (
    <div className="map-legend">
      <h3><Navigation size={16} /> Legend</h3>
      <div className="legend-items">
        {items.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-dot" style={{ background: item.color }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapsHeroVisual() {
  return (
    <div className="maps-hero-visual">
      <div className="mhv-globe">
        <Globe size={64} />
        <div className="mhv-orbit">
          <span className="mhv-satellite">
            <MapPin size={14} />
          </span>
        </div>
      </div>
      <div className="mhv-pins">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="mhv-pin"
            style={{
              animationDelay: `${i * 0.5}s`,
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
          >
            <MapPin size={12} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function MapsPage() {
  const [mode, setMode] = useState("regions");

  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Interactive Maps"
          title="Explore India Visually"
          copy="Navigate through India's geography, historical sites, and physical features with interactive maps. Click markers to learn about regions, monuments, and terrain."
          visual={<MapsHeroVisual />}
        />

        <MapModeSelector mode={mode} setMode={setMode} />

        <div className="maps-layout">
          <InteractiveIndiaMap mode={mode} />
          <MapLegend mode={mode} />
        </div>
      </div>
    </section>
  );
}
