import { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Crown,
  Flame,
  Gift,
  Gem,
  Lock,
  Map,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  Timer,
  Trophy,
  Unlock,
  Zap,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Shared";

/* ── Daily Challenge Data ── */
const dailyChallenges = [
  { id: 1, title: "Solve 5 Math Problems", xp: 50, type: "math", progress: 3, total: 5, icon: Brain },
  { id: 2, title: "Read a Science Chapter", xp: 75, type: "science", progress: 0, total: 1, icon: BookOpen },
  { id: 3, title: "Complete a Quiz Under 2min", xp: 100, type: "speed", progress: 0, total: 1, icon: Timer },
  { id: 4, title: "Answer 10 MCQs Correctly", xp: 60, type: "accuracy", progress: 7, total: 10, icon: Target },
];

/* ── Achievement Data ── */
const achievements = [
  { id: 1, title: "First Steps", description: "Complete your first lesson", icon: Rocket, earned: true, xp: 25, rarity: "common" },
  { id: 2, title: "Quiz Whiz", description: "Score 100% on any quiz", icon: Zap, earned: true, xp: 100, rarity: "rare" },
  { id: 3, title: "Week Warrior", description: "7-day learning streak", icon: Flame, earned: true, xp: 150, rarity: "rare" },
  { id: 4, title: "Knowledge Seeker", description: "Explore 5 different subjects", icon: Map, earned: true, xp: 75, rarity: "common" },
  { id: 5, title: "Speed Demon", description: "Finish a quiz in under 60s", icon: Timer, earned: false, xp: 200, rarity: "epic" },
  { id: 6, title: "Perfect Month", description: "30-day learning streak", icon: Crown, earned: false, xp: 500, rarity: "legendary" },
  { id: 7, title: "Master Scholar", description: "Complete all chapters in a subject", icon: Trophy, earned: false, xp: 300, rarity: "epic" },
  { id: 8, title: "Community Hero", description: "Help 50 students", icon: Shield, earned: false, xp: 250, rarity: "rare" },
];

/* ── Skill Tree Data ── */
const skillTrees = [
  {
    subject: "Mathematics",
    accent: "#60a5fa",
    icon: Brain,
    nodes: [
      { id: "basics", name: "Number Systems", level: 5, maxLevel: 5, unlocked: true },
      { id: "algebra", name: "Algebra", level: 4, maxLevel: 5, unlocked: true },
      { id: "geometry", name: "Geometry", level: 3, maxLevel: 5, unlocked: true },
      { id: "stats", name: "Statistics", level: 1, maxLevel: 5, unlocked: true },
      { id: "calculus", name: "Trigonometry", level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  {
    subject: "Science",
    accent: "#4ade80",
    icon: Sparkles,
    nodes: [
      { id: "physics", name: "Physics", level: 4, maxLevel: 5, unlocked: true },
      { id: "chemistry", name: "Chemistry", level: 3, maxLevel: 5, unlocked: true },
      { id: "biology", name: "Biology", level: 2, maxLevel: 5, unlocked: true },
      { id: "env", name: "Environment", level: 0, maxLevel: 5, unlocked: false },
      { id: "lab", name: "Lab Skills", level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  {
    subject: "Social Science",
    accent: "#fbbf24",
    icon: Map,
    nodes: [
      { id: "history", name: "History", level: 3, maxLevel: 5, unlocked: true },
      { id: "geo", name: "Geography", level: 2, maxLevel: 5, unlocked: true },
      { id: "civics", name: "Civics", level: 1, maxLevel: 5, unlocked: true },
      { id: "economics", name: "Economics", level: 0, maxLevel: 5, unlocked: false },
      { id: "map", name: "Map Skills", level: 0, maxLevel: 5, unlocked: false },
    ],
  },
];

/* ── Rewards Data ── */
const rewards = [
  { id: 1, title: "Custom Avatar Frame", cost: 500, icon: Gem, unlocked: false },
  { id: 2, title: "Dark Theme: Neon", cost: 750, icon: Sparkles, unlocked: false },
  { id: 3, title: "Profile Badge: Elite", cost: 1000, icon: Shield, unlocked: false },
  { id: 4, title: "Bonus XP Weekend Pass", cost: 1500, icon: Gift, unlocked: false },
];

/* ── Components ── */

function XPProgressBar() {
  const currentXP = 4280;
  const nextLevelXP = 5700;
  const level = 14;
  const percentage = (currentXP / nextLevelXP) * 100;

  return (
    <Reveal>
      <div className="gamified-xp-bar">
        <div className="xp-bar-header">
          <div className="xp-level-badge">
            <Star size={18} fill="currentColor" />
            <span>Level {level}</span>
          </div>
          <div className="xp-numbers">
            <span className="xp-current">{currentXP.toLocaleString()}</span>
            <span className="xp-divider">/</span>
            <span className="xp-max">{nextLevelXP.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="xp-progress-track">
          <div className="xp-progress-fill" style={{ width: `${percentage}%` }}>
            <div className="xp-progress-glow" />
          </div>
          <div className="xp-milestones">
            {[25, 50, 75].map((mark) => (
              <span
                key={mark}
                className={`xp-milestone ${percentage >= mark ? "reached" : ""}`}
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>
        </div>
        <p className="xp-to-go">{(nextLevelXP - currentXP).toLocaleString()} XP to Level {level + 1}</p>
      </div>
    </Reveal>
  );
}

function DailyChallengesSection() {
  const showToast = useToast();
  const [challenges, setChallenges] = useState(dailyChallenges);

  const claimReward = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, progress: c.total } : c))
    );
    showToast("Challenge completed! XP awarded 🎉");
  };

  return (
    <section className="gamified-section">
      <SectionHeading kicker="Daily Quests" title="Today's Challenges" />
      <StaggerContainer className="challenge-grid" staggerDelay={0.08}>
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          const isComplete = challenge.progress >= challenge.total;
          const pct = (challenge.progress / challenge.total) * 100;
          return (
            <StaggerItem key={challenge.id}>
              <div className={`challenge-card ${isComplete ? "completed" : ""}`}>
                <div className="challenge-icon-wrap">
                  <Icon size={22} />
                  {isComplete && (
                    <span className="challenge-check">
                      <CheckCircle2 size={14} />
                    </span>
                  )}
                </div>
                <div className="challenge-info">
                  <h3>{challenge.title}</h3>
                  <div className="challenge-progress-row">
                    <span className="challenge-track">
                      <span style={{ width: `${pct}%` }} />
                    </span>
                    <small>
                      {challenge.progress}/{challenge.total}
                    </small>
                  </div>
                </div>
                <div className="challenge-reward">
                  <span className="xp-chip">
                    <Zap size={12} />
                    +{challenge.xp} XP
                  </span>
                  {isComplete ? (
                    <span className="claimed-tag">✓ Done</span>
                  ) : (
                    <button
                      className="pill-button small"
                      type="button"
                      onClick={() => claimReward(challenge.id)}
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

function AchievementsSection() {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all"
      ? achievements
      : filter === "earned"
      ? achievements.filter((a) => a.earned)
      : achievements.filter((a) => !a.earned);

  const rarityColors: Record<string, string> = {
    common: "#94a3b8",
    rare: "#60a5fa",
    epic: "#c084fc",
    legendary: "#fbbf24",
  };

  return (
    <section className="gamified-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Collection</span>
          <h2 className="section-title">Achievements</h2>
        </div>
        <div className="tabs" role="tablist">
          {["all", "earned", "locked"].map((tab) => (
            <button
              key={tab}
              className={`tab ${filter === tab ? "active" : ""}`}
              type="button"
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <StaggerContainer className="achievements-grid" staggerDelay={0.06}>
        {filtered.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <StaggerItem key={achievement.id}>
              <div className={`achievement-card ${achievement.earned ? "earned" : "locked"}`}>
                <div
                  className="achievement-icon"
                  style={{
                    "--accent": rarityColors[achievement.rarity],
                  } as React.CSSProperties}
                >
                  {achievement.earned ? <Icon size={26} /> : <Lock size={20} />}
                </div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className="achievement-footer">
                  <span
                    className="rarity-badge"
                    style={{ color: rarityColors[achievement.rarity] }}
                  >
                    {achievement.rarity}
                  </span>
                  <span className="xp-chip">
                    <Zap size={11} />
                    {achievement.xp} XP
                  </span>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

function SkillTreeSection() {
  const [activeTree, setActiveTree] = useState(0);
  const tree = skillTrees[activeTree];
  const Icon = tree.icon;

  return (
    <section className="gamified-section">
      <SectionHeading kicker="Progression" title="Skill Trees" />
      <div className="skill-tree-tabs">
        {skillTrees.map((t, idx) => {
          const TIcon = t.icon;
          return (
            <button
              key={t.subject}
              className={`skill-tree-tab ${idx === activeTree ? "active" : ""}`}
              style={{ "--accent": t.accent } as React.CSSProperties}
              type="button"
              onClick={() => setActiveTree(idx)}
            >
              <TIcon size={16} />
              {t.subject}
            </button>
          );
        })}
      </div>
      <Reveal>
        <div className="skill-tree-container" style={{ "--accent": tree.accent } as React.CSSProperties}>
          <div className="skill-tree-header">
            <span className="skill-tree-icon">
              <Icon size={28} />
            </span>
            <div>
              <h3>{tree.subject} Mastery</h3>
              <p>
                {tree.nodes.filter((n) => n.level === n.maxLevel).length} of {tree.nodes.length} skills mastered
              </p>
            </div>
          </div>
          <div className="skill-nodes">
            {tree.nodes.map((node, idx) => {
              const pct = (node.level / node.maxLevel) * 100;
              return (
                <div key={node.id} className={`skill-node ${node.unlocked ? "unlocked" : "locked"}`}>
                  <div className="skill-node-connector">
                    {idx > 0 && <span className="skill-connector-line" />}
                    <span className={`skill-node-dot ${node.level === node.maxLevel ? "maxed" : ""}`}>
                      {node.unlocked ? (
                        node.level === node.maxLevel ? <Star size={14} fill="currentColor" /> : <span>{node.level}</span>
                      ) : (
                        <Lock size={12} />
                      )}
                    </span>
                  </div>
                  <div className="skill-node-info">
                    <h4>{node.name}</h4>
                    <div className="skill-progress-mini">
                      <span className="skill-progress-track">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                      <small>
                        Lv {node.level}/{node.maxLevel}
                      </small>
                    </div>
                  </div>
                  {node.level === node.maxLevel && (
                    <span className="skill-mastered-badge">
                      <Trophy size={13} />
                      Mastered
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function RewardsShop() {
  const showToast = useToast();
  const currentCoins = 2450;

  return (
    <section className="gamified-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Spend</span>
          <h2 className="section-title">Rewards Shop</h2>
        </div>
        <div className="coins-display">
          <Gem size={18} />
          <span>{currentCoins.toLocaleString()}</span>
          <small>Coins</small>
        </div>
      </div>
      <StaggerContainer className="rewards-grid" staggerDelay={0.08}>
        {rewards.map((reward) => {
          const Icon = reward.icon;
          const canAfford = currentCoins >= reward.cost;
          return (
            <StaggerItem key={reward.id}>
              <div className={`reward-card ${canAfford ? "affordable" : "expensive"}`}>
                <div className="reward-icon-wrap">
                  <Icon size={28} />
                </div>
                <h3>{reward.title}</h3>
                <div className="reward-cost">
                  <Gem size={14} />
                  <span>{reward.cost}</span>
                </div>
                <button
                  className={`pill-button small ${!canAfford ? "locked-btn" : ""}`}
                  type="button"
                  disabled={!canAfford}
                  onClick={() => showToast(`Unlocked: ${reward.title} 🎁`)}
                >
                  {canAfford ? "Unlock" : "Need More"}
                </button>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

function GamifiedHeroVisual() {
  return (
    <div className="gamified-hero-visual">
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="hero-trophy-stack">
        <div className="hero-trophy-card">
          <Trophy size={32} />
          <strong>Level 14</strong>
          <small>Scholar</small>
        </div>
        <div className="hero-stats-mini">
          <div>
            <Flame size={16} fill="currentColor" />
            <span>27 Day Streak</span>
          </div>
          <div>
            <Star size={16} fill="currentColor" />
            <span>4,280 XP</span>
          </div>
          <div>
            <Award size={16} />
            <span>12 Badges</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function GamifiedLearningPage() {
  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Gamified Learning"
          title="Level Up Your Knowledge"
          copy="Earn XP, unlock achievements, complete daily challenges, and progress through skill trees. Learning has never been this rewarding."
          visual={<GamifiedHeroVisual />}
        />
        <XPProgressBar />
        <DailyChallengesSection />
        <SkillTreeSection />
        <AchievementsSection />
        <RewardsShop />
      </div>
    </section>
  );
}
