import React, { useState } from 'react';
import { ScanItem } from '../types';
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Radar,
  Briefcase,
  Target
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, ResponsiveContainer } from 'recharts';

interface AnalyticsHubViewProps {
  scans?: ScanItem[];
}

export const AnalyticsHubView: React.FC<AnalyticsHubViewProps> = ({ scans = [] }) => {
  const [selectedRole, setSelectedRole] = useState('Full-Stack Web Developer');

  // Compute dynamic score history from actual scans
  const scoreHistory = scans.length > 0
    ? [...scans].reverse().slice(-5).map((scan, i, arr) => ({
        label: i === arr.length - 1 ? 'Current' : `V${i + 1}`,
        score: scan.atsScore,
        active: i === arr.length - 1
      }))
    : [];

  const latestScan = scans.length > 0 ? scans[0] : null;

  // Dynamic skill benchmarks per role
  const roleBenchmarksMap: Record<string, Array<{ skill: string; score: number; color: string; textColor: string; warning?: string }>> = {
    'Full-Stack Web Developer': [
      { skill: 'React/Next.js', score: latestScan ? Math.min(95, latestScan.atsScore + 8) : 92, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
      { skill: 'Node.js/Express', score: latestScan ? latestScan.atsScore : 85, color: 'bg-[#c0c1ff]', textColor: 'text-[#c0c1ff]' },
      { skill: 'Database Management', score: 60, color: 'bg-[#ffb4ab]', textColor: 'text-[#ffb4ab]', warning: 'Focus needed' },
      { skill: 'System Architecture', score: 75, color: 'bg-[#31394d]', textColor: 'text-[#c7c4d7]' },
    ],
    'Senior Backend Engineer': [
      { skill: 'Distributed Systems', score: 88, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
      { skill: 'PostgreSQL/Redis', score: 82, color: 'bg-[#c0c1ff]', textColor: 'text-[#c0c1ff]' },
      { skill: 'Kubernetes/Docker', score: 55, color: 'bg-[#ffb4ab]', textColor: 'text-[#ffb4ab]', warning: 'Focus needed' },
      { skill: 'API Performance', score: 90, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
    ],
    'Product Manager': [
      { skill: 'Product Strategy', score: 86, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
      { skill: 'User Research', score: 80, color: 'bg-[#c0c1ff]', textColor: 'text-[#c0c1ff]' },
      { skill: 'Data Analytics & SQL', score: 58, color: 'bg-[#ffb4ab]', textColor: 'text-[#ffb4ab]', warning: 'Focus needed' },
      { skill: 'Agile Roadmapping', score: 92, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
    ],
    'Data Scientist': [
      { skill: 'Python / PyTorch', score: 90, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
      { skill: 'Machine Learning', score: 84, color: 'bg-[#c0c1ff]', textColor: 'text-[#c0c1ff]' },
      { skill: 'Cloud MLOps', score: 52, color: 'bg-[#ffb4ab]', textColor: 'text-[#ffb4ab]', warning: 'Focus needed' },
      { skill: 'Statistical Modeling', score: 88, color: 'bg-[#4edea3]', textColor: 'text-[#4edea3]' },
    ],
  };

  const roleRadarMap: Record<string, Array<{ skill: string; candidate: number; jobReq: number }>> = {
    'Full-Stack Web Developer': [
      { skill: 'Frontend', candidate: latestScan?.formattingScore || 92, jobReq: 90 },
      { skill: 'Backend', candidate: latestScan?.keywordScore || 85, jobReq: 88 },
      { skill: 'Database', candidate: 60, jobReq: 75 },
      { skill: 'DevOps/Cloud', candidate: 45, jobReq: 70 },
      { skill: 'System Design', candidate: latestScan?.experienceImpactScore || 75, jobReq: 80 },
      { skill: 'Communication', candidate: 78, jobReq: 85 }
    ],
    'Senior Backend Engineer': [
      { skill: 'Frontend', candidate: 65, jobReq: 50 },
      { skill: 'Backend', candidate: latestScan?.keywordScore || 92, jobReq: 95 },
      { skill: 'Database', candidate: 82, jobReq: 90 },
      { skill: 'DevOps/Cloud', candidate: 55, jobReq: 80 },
      { skill: 'System Design', candidate: latestScan?.experienceImpactScore || 85, jobReq: 90 },
      { skill: 'Communication', candidate: 78, jobReq: 80 }
    ],
    'Product Manager': [
      { skill: 'Frontend', candidate: 50, jobReq: 40 },
      { skill: 'Backend', candidate: 45, jobReq: 40 },
      { skill: 'Database', candidate: 58, jobReq: 75 },
      { skill: 'DevOps/Cloud', candidate: 30, jobReq: 50 },
      { skill: 'System Design', candidate: 70, jobReq: 75 },
      { skill: 'Communication', candidate: 95, jobReq: 90 }
    ],
    'Data Scientist': [
      { skill: 'Frontend', candidate: 40, jobReq: 30 },
      { skill: 'Backend', candidate: 75, jobReq: 80 },
      { skill: 'Database', candidate: 88, jobReq: 90 },
      { skill: 'DevOps/Cloud', candidate: 52, jobReq: 75 },
      { skill: 'System Design', candidate: 72, jobReq: 80 },
      { skill: 'Communication', candidate: 80, jobReq: 85 }
    ],
  };

  const benchmarks = roleBenchmarksMap[selectedRole] || roleBenchmarksMap['Full-Stack Web Developer'];
  const radarData = roleRadarMap[selectedRole] || roleRadarMap['Full-Stack Web Developer'];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8 space-y-10 animate-fade-in">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#dae2fd]">Analytics Hub</h1>
        <p className="text-base text-[#c7c4d7] max-w-2xl">
          Deep dive into your resume performance metrics, candidate history, and industry benchmarks.
        </p>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Section 1: Score Progression */}
        <section className="glass-panel rounded-xl p-6 md:col-span-8 flex flex-col justify-between min-h-[380px]">
          <div>
            <h2 className="text-xl font-bold text-[#dae2fd] mb-1 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#c0c1ff]" />
              <span>Score Progression</span>
            </h2>
            <p className="text-sm text-[#c7c4d7]">
              ATS match percentage over recent scans ({scoreHistory.length} iterations tracked).
            </p>
          </div>

          <div className="flex-grow flex items-end justify-between mt-8 relative h-48 w-full border-b border-[#464554]/50 pb-2 px-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
              <div className="border-b border-[#464554]/20 w-full h-0"></div>
              <div className="border-b border-[#464554]/20 w-full h-0"></div>
              <div className="border-b border-[#464554]/20 w-full h-0"></div>
              <div className="border-b border-[#464554]/20 w-full h-0"></div>
            </div>

            {/* Bars */}
            {scoreHistory.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 z-10 space-y-2">
                <p className="text-sm font-semibold text-[#dae2fd]">No Score History Tracked Yet</p>
                <p className="text-xs text-[#908fa0] max-w-xs">Scan your first resume to plot performance trends and version progression here.</p>
              </div>
            ) : (
              scoreHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-end z-10 w-1/5 group cursor-pointer h-full"
                >
                  <div
                    className={`text-xs font-semibold mb-1 transition-opacity ${
                      item.active
                        ? 'text-[#c0c1ff] opacity-100 font-bold'
                        : 'text-[#c7c4d7] opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {item.score}%
                  </div>

                  <div className="w-12 sm:w-14 bg-[#1d2538] rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        item.active
                          ? 'bg-[#c0c1ff] glow-accent'
                          : 'bg-[#4edea3]/70 group-hover:bg-[#4edea3]'
                      }`}
                      style={{ height: `${Math.max(15, item.score)}%` }}
                    />
                  </div>

                  <div
                    className={`text-xs mt-2 ${
                      item.active ? 'text-[#c0c1ff] font-bold' : 'text-[#c7c4d7]'
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Industry Benchmark */}
        <section className="glass-panel rounded-xl p-6 md:col-span-4 flex flex-col min-h-[380px]">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[#dae2fd] mb-1 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#4edea3]" />
                <span>Industry Benchmark</span>
              </h2>
              <div className="text-sm text-[#c7c4d7] flex items-center space-x-1 mt-1">
                <span>Vs.</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-[#171f33] text-[#c0c1ff] text-xs font-semibold py-1 px-2 rounded border border-[#464554] focus:outline-none cursor-pointer"
                >
                  <option value="Full-Stack Web Developer">Full-Stack Web Developer</option>
                  <option value="Senior Backend Engineer">Senior Backend Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-5 flex-grow justify-center flex flex-col">
            {benchmarks.map((bm, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#dae2fd]">{bm.skill}</span>
                  <span className={bm.textColor}>{bm.score}%</span>
                </div>
                <div className="w-full bg-[#222a3d] rounded-full h-2 overflow-hidden">
                  <div
                    className={`${bm.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${bm.score}%` }}
                  />
                </div>
                {bm.warning && (
                  <p className="text-[11px] text-[#ffb4ab] mt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{bm.warning}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Skill Radar Chart */}
        <section className="glass-panel rounded-xl p-6 md:col-span-12 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#dae2fd] mb-1 flex items-center space-x-2">
              <Radar className="w-5 h-5 text-[#d0bcff]" />
              <span>Skill Match Radar ({selectedRole})</span>
            </h2>
            <p className="text-sm text-[#c7c4d7]">
              Candidate skills (solid area) vs. target job requirements (dashed) comparison across key competency areas.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                  <PolarGrid stroke="#464554" strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fill: '#c7c4d7', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#908fa0', fontSize: 11 }}
                    stroke="#464554"
                  />
                  <RechartsRadar 
                    name="Your Score" 
                    dataKey="candidate" 
                    stroke="#4edea3" 
                    fill="#4edea3" 
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <RechartsRadar 
                    name="Job Requirements" 
                    dataKey="jobReq" 
                    stroke="#c0c1ff" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-[#4edea3]"></div>
                  <span className="text-sm text-[#dae2fd] font-medium">Your Current Score</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full border-2 border-[#c0c1ff]"></div>
                  <span className="text-sm text-[#dae2fd] font-medium">Target Requirements</span>
                </div>
              </div>

              <div className="bg-[#131b2e] border border-[#464554]/50 rounded-lg p-4 space-y-3">
                <p className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Areas for Improvement</p>
                {radarData
                  .filter(item => (item.jobReq - item.candidate) > 0)
                  .map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />
                        <span className="text-sm text-[#dae2fd]">{item.skill}</span>
                      </div>
                      <div className="text-xs text-[#ffb4ab] font-semibold">
                        +{item.jobReq - item.candidate} points needed
                      </div>
                    </div>
                  ))}
              </div>

              <div className="bg-[#131b2e] border border-[#4edea3]/30 rounded-lg p-4 space-y-3">
                <p className="text-xs text-[#4edea3] font-semibold uppercase tracking-wider">Strengths</p>
                {radarData
                  .filter(item => (item.candidate - item.jobReq) >= 0)
                  .sort((a, b) => b.candidate - a.candidate)
                  .map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-[#dae2fd]">{item.skill}</span>
                      <div className="text-xs text-[#4edea3] font-semibold">
                        {item.candidate}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Action Verb Matrix */}
        <section className="glass-panel rounded-xl p-6 md:col-span-12 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#dae2fd] mb-1 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#d0bcff]" />
                <span>Action Verb Impact Matrix</span>
              </h2>
              <p className="text-sm text-[#c7c4d7]">
                Distribution of verb impact across your experience section.
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]"></span>
                <span className="text-[#c7c4d7]">Passive</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0c1ff]"></span>
                <span className="text-[#c7c4d7]">Active</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
                <span className="text-[#c7c4d7]">High-Impact</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#131b2e] border border-[#4edea3]/30 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#4edea3]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-xs font-bold text-[#4edea3] uppercase tracking-wider mb-3">
                High-Impact (Optimized)
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Architected', 'Spearheaded', 'Optimized', 'Engineered', 'Transformed'].map(
                  (verb, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/50 rounded-full text-xs font-medium"
                    >
                      {verb}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="bg-[#131b2e] border border-[#8083ff]/30 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#8083ff]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-xs font-bold text-[#c0c1ff] uppercase tracking-wider mb-3">
                Active (Standard)
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Developed', 'Created', 'Managed', 'Led', 'Designed'].map((verb, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/50 rounded-full text-xs font-medium"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#131b2e] border border-[#ffb4ab]/30 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffb4ab]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-xs font-bold text-[#ffb4ab] uppercase tracking-wider mb-3">
                Passive (Needs Improvement)
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { word: 'Helped', suggestion: 'Consider: Facilitated or Supported' },
                  { word: 'Worked on', suggestion: 'Consider: Executed or Delivered' },
                  { word: 'Was responsible for', suggestion: 'Consider: Directed or Orchestrated' },
                ].map((item, i) => (
                  <div key={i} className="relative group cursor-help">
                    <span className="px-3 py-1 bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/50 rounded-full text-xs font-medium inline-block">
                      {item.word}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-max bg-[#0b1326] px-2.5 py-1 rounded border border-[#464554] text-[#dae2fd] text-[10px] z-20 shadow-lg">
                      {item.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
