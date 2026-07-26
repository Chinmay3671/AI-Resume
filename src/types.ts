export type NavTab = 'hero' | 'scanner' | 'dashboard' | 'analytics' | 'pricing';

export type ScanStatus = 'Passed' | 'Review' | 'Fixes Needed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  tier?: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

export interface BulletPoint {
  id: string;
  section: string;
  original: string;
  optimized: string;
  verbImpact: 'high' | 'active' | 'passive';
}

export interface SkillBenchmark {
  name: string;
  score: number;
  warning?: string;
}

export interface HardSkillsData {
  matched: string[];
  missing: string[];
  score?: number;
}

export interface SoftSkillsData {
  identified: string[];
  score?: number;
}

export interface CertificationsData {
  current: string[];
  recommended: string[];
  priority?: 'high' | 'medium' | 'low';
}

export interface ExperienceYearsData {
  total: number;
  inTargetRole: number;
  description?: string;
}

export interface ScanItem {
  id: string;
  documentName: string;
  date: string;
  atsScore: number;
  status: ScanStatus;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingScore?: number;
  keywordScore?: number;
  experienceImpactScore?: number;
  hardSkills?: HardSkillsData;
  softSkills?: SoftSkillsData;
  certifications?: CertificationsData;
  experienceYears?: ExperienceYearsData;
  bulletPoints: BulletPoint[];
  benchmarks?: {
    role: string;
    skills: SkillBenchmark[];
  };
  jobDescription?: string;
  resumeText?: string;
}

export interface UserStats {
  totalAnalyzed: number;
  avgAtsScore: number;
  aiRewritesUsed: number;
}
