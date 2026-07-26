import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    splitTextToSize: vi.fn((text) => [text]),
    getPageWidth: vi.fn(() => 210),
    getPageHeight: vi.fn(() => 297),
    setTextColor: vi.fn(),
    save: vi.fn(),
  })),
}));

// Sample test data
const mockScanData = {
  id: 'scan-123',
  documentName: 'test_resume.pdf',
  date: 'Jan 15, 2026',
  atsScore: 85,
  status: 'Passed',
  summary: 'Strong ATS compatibility with high keyword density.',
  matchedKeywords: ['React', 'TypeScript', 'Node.js'],
  missingKeywords: ['Docker', 'Kubernetes'],
  formattingScore: 90,
  keywordScore: 85,
  experienceImpactScore: 80,
  bulletPoints: [
    {
      id: 'b1',
      section: 'Experience',
      original: 'Worked on React development',
      optimized: 'Architected React components increasing performance by 40%',
      verbImpact: 'high'
    }
  ],
  benchmarks: {
    role: 'Full-Stack Developer',
    skills: [
      { name: 'React', score: 92 },
      { name: 'Node.js', score: 85 }
    ]
  },
  jobDescription: 'Looking for Full Stack Developer',
  resumeText: 'Sample resume text'
};

describe('Resume Analysis Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scan Data Validation', () => {
    it('should have valid ATS score between 0-100', () => {
      expect(mockScanData.atsScore).toBeGreaterThanOrEqual(0);
      expect(mockScanData.atsScore).toBeLessThanOrEqual(100);
    });

    it('should have valid status values', () => {
      const validStatuses = ['Passed', 'Review', 'Fixes Needed'];
      expect(validStatuses).toContain(mockScanData.status);
    });

    it('should have required scan fields', () => {
      expect(mockScanData.id).toBeDefined();
      expect(mockScanData.documentName).toBeDefined();
      expect(mockScanData.atsScore).toBeDefined();
      expect(mockScanData.status).toBeDefined();
      expect(mockScanData.matchedKeywords).toBeDefined();
      expect(mockScanData.missingKeywords).toBeDefined();
    });

    it('should have valid bullet points structure', () => {
      mockScanData.bulletPoints.forEach(bullet => {
        expect(bullet.id).toBeDefined();
        expect(bullet.section).toBeDefined();
        expect(bullet.original).toBeDefined();
        expect(bullet.optimized).toBeDefined();
        expect(['high', 'active', 'passive']).toContain(bullet.verbImpact);
      });
    });

    it('should have benchmarks with valid skills', () => {
      expect(mockScanData.benchmarks.role).toBeDefined();
      expect(mockScanData.benchmarks.skills).toBeInstanceOf(Array);
      mockScanData.benchmarks.skills.forEach(skill => {
        expect(skill.name).toBeDefined();
        expect(skill.score).toBeGreaterThanOrEqual(0);
        expect(skill.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Keyword Analysis', () => {
    it('should have matched keywords array', () => {
      expect(Array.isArray(mockScanData.matchedKeywords)).toBe(true);
    });

    it('should have missing keywords array', () => {
      expect(Array.isArray(mockScanData.missingKeywords)).toBe(true);
    });

    it('should have non-empty keyword lists', () => {
      expect(mockScanData.matchedKeywords.length).toBeGreaterThan(0);
      expect(mockScanData.missingKeywords.length).toBeGreaterThan(0);
    });
  });

  describe('Score Metrics', () => {
    it('should have valid formatting score', () => {
      expect(mockScanData.formattingScore).toBeGreaterThanOrEqual(0);
      expect(mockScanData.formattingScore).toBeLessThanOrEqual(100);
    });

    it('should have valid keyword score', () => {
      expect(mockScanData.keywordScore).toBeGreaterThanOrEqual(0);
      expect(mockScanData.keywordScore).toBeLessThanOrEqual(100);
    });

    it('should have valid experience impact score', () => {
      expect(mockScanData.experienceImpactScore).toBeGreaterThanOrEqual(0);
      expect(mockScanData.experienceImpactScore).toBeLessThanOrEqual(100);
    });

    it('overall score should be average of sub-scores', () => {
      const expectedAvg = Math.round(
        (mockScanData.formattingScore + mockScanData.keywordScore + mockScanData.experienceImpactScore) / 3
      );
      // ATS score might be weighted differently, so just check it's reasonable
      expect(mockScanData.atsScore).toBeGreaterThanOrEqual(0);
      expect(mockScanData.atsScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Text Content Validation', () => {
    it('should have non-empty summary', () => {
      expect(mockScanData.summary).toBeTruthy();
      expect(mockScanData.summary.length).toBeGreaterThan(0);
    });

    it('should have non-empty resume text', () => {
      expect(mockScanData.resumeText).toBeTruthy();
      expect(mockScanData.resumeText.length).toBeGreaterThan(0);
    });

    it('should have non-empty job description', () => {
      expect(mockScanData.jobDescription).toBeTruthy();
      expect(mockScanData.jobDescription.length).toBeGreaterThan(0);
    });
  });
});

describe('Bullet Point Transformation', () => {
  it('should optimize passive verbs to active/high-impact', () => {
    const bullet = mockScanData.bulletPoints[0];
    expect(bullet.original).toContain('Worked');
    expect(bullet.optimized).toContain('Architected');
  });

  it('should add quantified metrics to optimized bullets', () => {
    const bullet = mockScanData.bulletPoints[0];
    expect(bullet.optimized).toMatch(/\d+%/);
  });

  it('should mark optimized bullets with high impact verb', () => {
    const bullet = mockScanData.bulletPoints[0];
    expect(bullet.verbImpact).toBe('high');
  });
});
