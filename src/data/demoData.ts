import { UserProfile, SocialPost } from "../types";

/**
 * STRICT SEPARATION: DEMO / SAMPLE DATASET
 * This file contains strictly labeled sample items for development & layout verification only.
 * Under EconoSphere AI's "Strict Real User / No Fake Profile Policy":
 * - Production mode contains ONLY real registered users and verified database records.
 * - Demo items are NEVER mixed with real users.
 * - Every demo item is visibly labeled: "DEMO DATA".
 */

export const DEMO_DATASET_INFO = {
  environment: "DEMO / SAMPLE DATA",
  notice: "Development-only dataset. Not real platform users or engagement.",
  label: "DEMO DATA",
};

export const DEMO_USERS: (UserProfile & { isDemo: true; demoNotice: string })[] = [
  {
    id: "demo-user-1",
    personalId: "DEMO-000001",
    username: "demo_economist_1",
    fullName: "Sample Economist A (Demo)",
    email: "demo.scholar.a@example.org",
    role: "economist",
    country: "Bangladesh",
    region: "Dhaka Division",
    city: "Dhaka",
    education: "Ph.D. in Economics",
    institution: "Sample Economics Department",
    fieldOfStudy: "Development Macroeconomics",
    professionalRole: "Sample Visiting Fellow",
    bio: "[DEMO PROFILE] Sample profile for development layout testing only.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    skills: ["Econometrics", "Time Series", "Policy Analysis"],
    researchInterests: ["Price Transmission", "Food Security"],
    badges: [{ id: "b-demo", name: "DEMO DATA", icon: "Flask", issuer: "Dev Environment", date: "2026" }],
    achievements: ["[DEMO] Sample item for UI testing"],
    publicationsCount: 1,
    projectsCount: 1,
    followersCount: 0,
    followingCount: 0,
    connectionsCount: 0,
    followers: [],
    following: [],
    connections: [],
    privacy: { isPublic: true, showEmail: false, showPhone: false },
    emailVerified: false,
    phoneVerified: false,
    createdAt: "2026-01-01",
    isDemo: true,
    demoNotice: "DEMO DATA",
  },
  {
    id: "demo-user-2",
    personalId: "DEMO-000002",
    username: "demo_researcher_2",
    fullName: "Sample Researcher B (Demo)",
    email: "demo.scholar.b@example.org",
    role: "researcher",
    country: "Global",
    region: "North America",
    city: "New York",
    education: "M.S. in Econometrics",
    institution: "Sample Policy Institute",
    fieldOfStudy: "Trade & Industrial Economics",
    professionalRole: "Sample Research Associate",
    bio: "[DEMO PROFILE] Sample profile for testing multi-user rendering.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    skills: ["Stata", "Python", "Spatial Econometrics"],
    researchInterests: ["Global Value Chains", "Tariff Incidence"],
    badges: [{ id: "b-demo-2", name: "DEMO DATA", icon: "Flask", issuer: "Dev Environment", date: "2026" }],
    achievements: ["[DEMO] Sample item for UI testing"],
    publicationsCount: 1,
    projectsCount: 0,
    followersCount: 0,
    followingCount: 0,
    connectionsCount: 0,
    followers: [],
    following: [],
    connections: [],
    privacy: { isPublic: true, showEmail: false, showPhone: false },
    emailVerified: false,
    phoneVerified: false,
    createdAt: "2026-01-01",
    isDemo: true,
    demoNotice: "DEMO DATA",
  },
];

export const DEMO_POSTS: (SocialPost & { isDemo: true; demoNotice: string })[] = [
  {
    id: "demo-post-1",
    authorId: "demo-user-1",
    authorName: "Sample Economist A (Demo)",
    authorPersonalId: "DEMO-000001",
    authorRole: "Sample Fellow",
    authorInstitution: "Sample Economics Department",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    postType: "analysis",
    title: "[DEMO DATA] Sample Agricultural Marketing Margin Specification",
    content: "[DEMO DATA] This is a sample research note displayed exclusively in development preview mode. It illustrates how empirical findings and econometric margin equations render in the feed interface.",
    connections: {
      country: "Bangladesh",
      product: "Rice",
      indicator: "Food CPI",
    },
    likes: [],
    bookmarks: [],
    sharesCount: 0,
    comments: [],
    createdAt: "2026-01-01T00:00:00Z",
    isDemo: true,
    demoNotice: "DEMO DATA",
  },
];
