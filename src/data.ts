import {
  Atom,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  Castle,
  Code2,
  FileCheck2,
  Flame,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  LayoutGrid,
  Lightbulb,
  LineChart,
  Palette,
  Rocket,
  ShieldCheck,
  Target,
  Trophy,
  Users
} from "lucide-react";
import type { Subject, Course, Stat, JourneyStep, Badge, LeaderboardEntry, Testimonial, QuizQuestion, LearningPath, CommunityPost, SearchBoost } from "./types";

export const subjects: Subject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    shortName: "Math",
    lessons: "1,240",
    progress: 72,
    icon: Calculator,
    accent: "#60a5fa",
    tint: "rgba(96, 165, 250, 0.12)",
    description: "Algebra, calculus, geometry, statistics, and visual problem solving.",
    tracks: ["Algebra foundations", "Calculus studio", "Statistics lab", "Linear algebra"]
  },
  {
    slug: "science",
    name: "Science",
    shortName: "Science",
    lessons: "980",
    progress: 45,
    icon: Atom,
    accent: "#4ade80",
    tint: "rgba(74, 222, 128, 0.12)",
    description: "Biology, chemistry, physics, astronomy, and inquiry-based labs.",
    tracks: ["Organic chemistry", "Physics in motion", "Biology systems", "Astrophysics"]
  },
  {
    slug: "computing",
    name: "Computing",
    shortName: "Coding",
    lessons: "860",
    progress: 60,
    icon: Code2,
    accent: "#c084fc",
    tint: "rgba(192, 132, 252, 0.12)",
    description: "Programming, data structures, web apps, AI basics, and algorithms.",
    tracks: ["Python projects", "Data structures", "Web interfaces", "AI foundations"]
  },
  {
    slug: "economics",
    name: "Economics",
    shortName: "Economics",
    lessons: "520",
    progress: 30,
    icon: LineChart,
    accent: "#ffd400",
    tint: "rgba(255, 212, 0, 0.12)",
    description: "Microeconomics, markets, finance, game theory, and decision science.",
    tracks: ["Microeconomics", "Market design", "Personal finance", "Global trade"]
  },
  {
    slug: "arts-humanities",
    name: "Arts & Humanities",
    shortName: "Arts",
    lessons: "740",
    progress: 55,
    icon: Palette,
    accent: "#f472b6",
    tint: "rgba(244, 114, 182, 0.12)",
    description: "Art history, literature, philosophy, music, and creative critique.",
    tracks: ["Art history", "World literature", "Philosophy", "Creative process"]
  },
  {
    slug: "history",
    name: "History",
    shortName: "History",
    lessons: "640",
    progress: 20,
    icon: Castle,
    accent: "#fbbf24",
    tint: "rgba(251, 191, 36, 0.12)",
    description: "Ancient civilizations, modern history, civics, and historical thinking.",
    tracks: ["Ancient worlds", "Modern revolutions", "Civics", "Primary sources"]
  },
  {
    slug: "test-prep",
    name: "Test Prep",
    shortName: "Prep",
    lessons: "380",
    progress: 10,
    icon: FileCheck2,
    accent: "#f87171",
    tint: "rgba(248, 113, 113, 0.12)",
    description: "Timed practice, exam strategy, diagnostics, and targeted remediation.",
    tracks: ["SAT math", "AP chemistry", "Reading speed", "Exam strategy"]
  },
  {
    slug: "life-skills",
    name: "Life Skills",
    shortName: "Life",
    lessons: "290",
    progress: 0,
    icon: HeartPulse,
    accent: "#2dd4bf",
    tint: "rgba(45, 212, 191, 0.12)",
    description: "Communication, wellbeing, productivity, finance, and career readiness.",
    tracks: ["Financial habits", "Communication", "Career readiness", "Wellbeing"]
  }
];

export const courses: Course[] = [
  {
    id: "linear-algebra",
    title: "Linear Algebra Fundamentals",
    category: "math",
    subjectSlug: "mathematics",
    subject: "Math",
    level: "Beginner",
    instructor: "Dr. Sarah Chen",
    rating: "4.9",
    progress: 35,
    lessons: 48,
    duration: "7h 20m",
    image: "https://picsum.photos/seed/math-linear/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher1/80/80.jpg",
    description:
      "Master vectors, matrices, transformations, and eigenvalues with visual intuition and hands-on practice.",
    outcomes: ["Build vector intuition", "Solve matrix systems", "Understand transformations", "Use eigenvectors in context"],
    accent: "#60a5fa",
    tint: "rgba(96, 165, 250, 0.15)",
    icon: Calculator
  },
  {
    id: "organic-chemistry",
    title: "Organic Chemistry",
    category: "science",
    subjectSlug: "science",
    subject: "Science",
    level: "Intermediate",
    instructor: "Prof. James Miller",
    rating: "4.8",
    progress: 68,
    lessons: 56,
    duration: "9h 10m",
    image: "https://picsum.photos/seed/chemistry-org/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher2/80/80.jpg",
    description:
      "Understand molecular structures, reaction mechanisms, stereochemistry, and synthesis from the ground up.",
    outcomes: ["Read mechanisms", "Predict products", "Recognize functional groups", "Plan synthesis routes"],
    accent: "#4ade80",
    tint: "rgba(74, 222, 128, 0.14)",
    icon: FlaskConical
  },
  {
    id: "python-programming",
    title: "Python Programming",
    category: "coding",
    subjectSlug: "computing",
    subject: "Coding",
    level: "Beginner",
    instructor: "Alex Rivera",
    rating: "4.9",
    progress: 12,
    lessons: 42,
    duration: "6h 45m",
    image: "https://picsum.photos/seed/coding-python/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher3/80/80.jpg",
    description:
      "Go from zero to practical Python by building small tools, visualizations, and data-driven projects.",
    outcomes: ["Write clean Python", "Use loops and functions", "Work with files", "Build mini projects"],
    accent: "#c084fc",
    tint: "rgba(192, 132, 252, 0.15)",
    icon: Code2
  },
  {
    id: "calculus-limits",
    title: "Calculus: Limits to Integrals",
    category: "math",
    subjectSlug: "mathematics",
    subject: "Math",
    level: "Advanced",
    instructor: "Dr. Emily Park",
    rating: "4.7",
    progress: 0,
    lessons: 61,
    duration: "10h 05m",
    image: "https://picsum.photos/seed/calculus-adv/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher4/80/80.jpg",
    description:
      "A complete calculus journey through limits, derivatives, integrals, and real-world applications.",
    outcomes: ["Reason with limits", "Differentiate functions", "Integrate areas", "Model change"],
    accent: "#60a5fa",
    tint: "rgba(96, 165, 250, 0.15)",
    icon: BarChart3
  },
  {
    id: "astrophysics",
    title: "Astrophysics: Stars & Galaxies",
    category: "science",
    subjectSlug: "science",
    subject: "Science",
    level: "Intermediate",
    instructor: "Dr. Neil Gupta",
    rating: "4.9",
    progress: 82,
    lessons: 44,
    duration: "8h 30m",
    image: "https://picsum.photos/seed/astro-physics/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher5/80/80.jpg",
    description:
      "Explore stellar evolution, black holes, dark matter, galaxies, and the instruments behind discovery.",
    outcomes: ["Explain star cycles", "Compare galaxies", "Read sky data", "Model gravity"],
    accent: "#4ade80",
    tint: "rgba(74, 222, 128, 0.14)",
    icon: Rocket
  },
  {
    id: "data-structures",
    title: "Data Structures & Algorithms",
    category: "coding",
    subjectSlug: "computing",
    subject: "Coding",
    level: "Intermediate",
    instructor: "Lisa Zhang",
    rating: "4.8",
    progress: 50,
    lessons: 64,
    duration: "11h 15m",
    image: "https://picsum.photos/seed/data-struct/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher6/80/80.jpg",
    description:
      "Ace technical problem solving with visual explanations of arrays, trees, graphs, and dynamic programming.",
    outcomes: ["Trace algorithms", "Compare complexity", "Use trees and graphs", "Practice interviews"],
    accent: "#c084fc",
    tint: "rgba(192, 132, 252, 0.15)",
    icon: Code2
  },
  {
    id: "microeconomics",
    title: "Microeconomics 101",
    category: "economics",
    subjectSlug: "economics",
    subject: "Economics",
    level: "Beginner",
    instructor: "Maya Nair",
    rating: "4.7",
    progress: 22,
    lessons: 38,
    duration: "5h 55m",
    image: "https://picsum.photos/seed/market-design/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher7/80/80.jpg",
    description:
      "Study incentives, scarcity, markets, externalities, and how everyday choices become economic systems.",
    outcomes: ["Read demand curves", "Explain incentives", "Analyze markets", "Model tradeoffs"],
    accent: "#ffd400",
    tint: "rgba(255, 212, 0, 0.12)",
    icon: LineChart
  },
  {
    id: "ancient-civilizations",
    title: "World History: Ancient Civilizations",
    category: "history",
    subjectSlug: "history",
    subject: "History",
    level: "Beginner",
    instructor: "Owen Brooks",
    rating: "4.8",
    progress: 5,
    lessons: 51,
    duration: "7h 05m",
    image: "https://picsum.photos/seed/ancient-history/900/520.jpg",
    avatar: "https://picsum.photos/seed/teacher8/80/80.jpg",
    description:
      "Compare early societies, trade routes, monuments, belief systems, and the evidence historians use.",
    outcomes: ["Use timelines", "Compare societies", "Read primary sources", "Connect geography"],
    accent: "#fbbf24",
    tint: "rgba(251, 191, 36, 0.13)",
    icon: Landmark
  }
];

export const stats: Stat[] = [
  { value: "4.2M+", label: "Learners" },
  { value: "8,500+", label: "Lessons" },
  { value: "150+", label: "Subjects" },
  { value: "100%", label: "Free" }
];

export const journeySteps: JourneyStep[] = [
  {
    number: "01",
    title: "Choose Your Path",
    description:
      "Browse hundreds of courses across subjects. Follow a structured learning path or explore freely at your own pace.",
    icon: BookOpen
  },
  {
    number: "02",
    title: "Learn Interactively",
    description:
      "Watch lessons, read concise guides, and work through adaptive exercises that respond to your level.",
    icon: Lightbulb
  },
  {
    number: "03",
    title: "Master & Earn",
    description:
      "Practice until the idea clicks. Earn badges, track streaks, and watch your skills grow over time.",
    icon: Trophy
  }
];

export const badges: Badge[] = [
  { label: "7-Day", icon: Flame, accent: "#ffd400" },
  { label: "Math Pro", icon: Calculator, accent: "#60a5fa" },
  { label: "Coder", icon: Code2, accent: "#c084fc" },
  { label: "Quiz Ace", icon: BadgeCheck, accent: "#4ade80" }
];

export const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Priya Sharma",
    level: "Level 24",
    xp: "12,480",
    streak: 89,
    image: "https://picsum.photos/seed/user1/80/80.jpg",
    highlight: true
  },
  {
    rank: 2,
    name: "Marcus Johnson",
    level: "Level 21",
    xp: "10,920",
    streak: 64,
    image: "https://picsum.photos/seed/user2/80/80.jpg"
  },
  {
    rank: 3,
    name: "Yuki Tanaka",
    level: "Level 19",
    xp: "9,350",
    streak: 45,
    image: "https://picsum.photos/seed/user3/80/80.jpg"
  },
  {
    rank: 4,
    name: "Aisha Okonkwo",
    level: "Level 17",
    xp: "8,110",
    streak: 38,
    image: "https://picsum.photos/seed/user4/80/80.jpg"
  },
  {
    rank: 5,
    name: "You",
    level: "Level 14",
    xp: "4,280",
    streak: 27,
    image: "https://picsum.photos/seed/currentuser/80/80.jpg",
    current: true
  }
];

export const testimonials: Testimonial[] = [
  {
    name: "Maria G.",
    role: "College Freshman",
    rating: 5,
    quote:
      "EduSpark helped me go from struggling with algebra to acing calculus. The interactive exercises make all the difference.",
    image: "https://picsum.photos/seed/test1/80/80.jpg"
  },
  {
    name: "Raj P.",
    role: "High School Junior",
    rating: 5,
    quote:
      "I use EduSpark every day to supplement my school work. The streak feature keeps me motivated and the badges are satisfying to earn.",
    image: "https://picsum.photos/seed/test2/80/80.jpg"
  },
  {
    name: "Ms. Thompson",
    role: "Math Teacher",
    rating: 4,
    quote:
      "As a teacher, I recommend EduSpark to my students. The curriculum and practice problems align beautifully with standards.",
    image: "https://picsum.photos/seed/test3/80/80.jpg"
  },
  {
    name: "Chen W.",
    role: "Career Changer",
    rating: 5,
    quote:
      "The coding courses on EduSpark are world-class. I went from zero programming knowledge to building my first app in 3 months.",
    image: "https://picsum.photos/seed/test4/80/80.jpg"
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    topic: "Derivatives",
    prompt: "What is the derivative of f(x) = 3x^2 + 2x - 5?",
    options: ["f'(x) = 3x + 2", "f'(x) = 6x + 2", "f'(x) = 6x^2 + 2", "f'(x) = 6x - 5"],
    correctIndex: 1,
    hint: "Use the power rule: d/dx(x^n) = nx^(n-1)."
  },
  {
    topic: "Python",
    prompt: "Which data type is best for storing unique values in Python?",
    options: ["list", "tuple", "set", "string"],
    correctIndex: 2,
    hint: "The collection automatically removes duplicates."
  },
  {
    topic: "Chemistry",
    prompt: "What kind of bond involves sharing electron pairs between atoms?",
    options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
    correctIndex: 1,
    hint: "Sharing is the key word in the question."
  },
  {
    topic: "Economics",
    prompt: "When price rises and quantity demanded falls, what relationship is shown?",
    options: ["Supply curve", "Demand curve", "Opportunity cost", "Market surplus"],
    correctIndex: 1,
    hint: "Think from the buyer side of the market."
  },
  {
    topic: "History",
    prompt: "Primary sources are most valuable because they are...",
    options: ["Always unbiased", "Created after historians debate", "Direct evidence from the period", "Easier to read than textbooks"],
    correctIndex: 2,
    hint: "They come from the time or people being studied."
  }
];

export const learningPaths: LearningPath[] = [
  {
    title: "STEM Builder",
    description: "A structured path through algebra, physics, chemistry, and programming.",
    icon: Brain,
    courses: 18,
    accent: "#60a5fa"
  },
  {
    title: "Career Switch",
    description: "Programming fundamentals, portfolios, interview practice, and career readiness.",
    icon: Target,
    courses: 12,
    accent: "#c084fc"
  },
  {
    title: "Teacher Toolkit",
    description: "Ready-to-use lessons, diagnostics, classroom reports, and extra practice sets.",
    icon: GraduationCap,
    courses: 24,
    accent: "#4ade80"
  }
];

export const communityPosts: CommunityPost[] = [
  {
    title: "Best visual trick for understanding eigenvectors?",
    author: "Nora K.",
    replies: 18,
    tag: "Mathematics"
  },
  {
    title: "Daily Python challenge thread: arrays and maps",
    author: "Alex R.",
    replies: 42,
    tag: "Coding"
  },
  {
    title: "How I prepared for AP Chemistry in 30 days",
    author: "Sam W.",
    replies: 27,
    tag: "Test Prep"
  }
];

export const searchBoosts: SearchBoost[] = [
  { title: "Interactive practice", icon: LayoutGrid, to: "/practice" },
  { title: "Community leaderboard", icon: Users, to: "/community" },
  { title: "Exam readiness", icon: ShieldCheck, to: "/subjects/test-prep" },
  { title: "Achievement badges", icon: Award, to: "/practice" }
];
