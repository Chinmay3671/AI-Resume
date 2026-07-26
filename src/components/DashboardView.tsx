import React, { useState } from 'react';
import { ScanItem, UserStats } from '../types';
import {
  FileText,
  TrendingUp,
  Sparkles,
  Filter,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Zap
} from 'lucide-react';

interface DashboardViewProps {
  scans: ScanItem[];
  stats: UserStats;
  onViewScan: (scan: ScanItem) => void;
  onDeleteScan: (id: string) => void;
  onResetHistory?: () => void;
  onNavigateScanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scans,
  stats,
  onViewScan,
  onDeleteScan,
  onResetHistory,
  onNavigateScanner,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const filteredScans = scans.filter((scan) => {
    const matchesStatus =
      filterStatus === 'all' ||
      scan.status.toLowerCase().replace(' ', '') === filterStatus.toLowerCase().replace(' ', '');
    const matchesSearch =
      scan.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredScans.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedScans = filteredScans.slice(startIndex, startIndex + pageSize);

  const handleDownloadReport = async (scan: ScanItem) => {
    try {
      const { generateReportPDF } = await import('../utils/pdfExport');
      generateReportPDF(scan);
    } catch (e) {
      console.error('PDF export error:', e);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8 space-y-10 animate-fade-in">
      {/* Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#dae2fd] mb-1">
            Dashboard & Resume History
          </h1>
          <p className="text-[#c7c4d7] text-sm md:text-base">
            Track overall ATS score trends and manage previously parsed resumes.
          </p>
        </div>

        <button
          onClick={onNavigateScanner}
          className="self-start md:self-auto px-5 py-2.5 bg-[#8083ff] text-[#0d0096] font-bold text-sm rounded-xl glass-glow-accent hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Scan New Resume</span>
        </button>
      </div>

      {/* Top Key Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between hover:glow-accent transition-all duration-300 border border-[#464554]/30">
          <div>
            <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-1">
              Total Resumes Analyzed
            </p>
            <p className="text-3xl font-extrabold text-[#dae2fd]">{stats.totalAnalyzed}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center justify-between hover:glow-accent transition-all duration-300 border border-[#464554]/30">
          <div>
            <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-1">
              Average ATS Score
            </p>
            <p className="text-3xl font-extrabold text-[#4edea3]">{stats.avgAtsScore}%</p>
          </div>
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#4edea3 ${stats.avgAtsScore * 3.6}deg, #1d2538 0deg)`
            }}
          >
            <div className="w-9 h-9 bg-[#0b1326] rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#4edea3]" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center justify-between hover:glow-accent transition-all duration-300 border border-[#464554]/30">
          <div>
            <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-1">
              AI Rewrites Generated
            </p>
            <p className="text-3xl font-extrabold text-[#d0bcff]">{stats.aiRewritesUsed}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#571bc1]/20 flex items-center justify-center text-[#d0bcff]">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* History Controls Bar */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#464554]/30">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-[#dae2fd]">Past Scans</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-xs font-bold">
              {filteredScans.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#908fa0] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#131b2e] border border-[#464554]/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#131b2e] border border-[#464554]/50 text-[#dae2fd] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#c0c1ff]"
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="review">Review</option>
              <option value="fixesneeded">Fixes Needed</option>
            </select>

            {/* View Mode Switcher (Grid vs Table) */}
            <div className="flex items-center bg-[#131b2e] border border-[#464554]/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#8083ff] text-[#0d0096]'
                    : 'text-[#908fa0] hover:text-[#dae2fd]'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#8083ff] text-[#0d0096]'
                    : 'text-[#908fa0] hover:text-[#dae2fd]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Reset History Button */}
            {onResetHistory && (
              <button
                onClick={() => setShowConfirmReset(true)}
                title="Reset Scan History"
                className="bg-[#2d3449] hover:bg-[#31394d] text-[#ffb4ab] border border-[#ffb4ab]/40 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset History</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {paginatedScans.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-[#464554]/30">
            <FileText className="w-12 h-12 text-[#908fa0] mx-auto" />
            <h3 className="text-lg font-bold text-[#dae2fd]">No resumes match your filter</h3>
            <p className="text-xs text-[#c7c4d7]">Try clearing search keywords or run a new ATS scan.</p>
            <button
              onClick={onNavigateScanner}
              className="px-4 py-2 bg-[#8083ff] text-[#0d0096] font-bold text-xs rounded-xl cursor-pointer"
            >
              Scan Resume Now
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW SHOWCASE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {paginatedScans.map((scan) => (
              <div
                key={scan.id}
                className="glass-card rounded-2xl p-6 border border-[#464554]/40 hover:border-[#c0c1ff]/50 transition-all flex flex-col justify-between space-y-5 hover:shadow-2xl group"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#8083ff]/15 flex items-center justify-center text-[#c0c1ff] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#dae2fd] line-clamp-1 group-hover:text-[#c0c1ff] transition-colors">
                          {scan.documentName}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-[11px] text-[#908fa0] mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{scan.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Circular Score Badge */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-[#2d3449]"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          stroke="currentColor"
                          strokeWidth="4"
                          className={
                            scan.atsScore >= 80
                              ? 'text-[#4edea3]'
                              : scan.atsScore >= 70
                              ? 'text-[#d0bcff]'
                              : 'text-[#ffb4ab]'
                          }
                          strokeDasharray={119}
                          strokeDashoffset={119 - (119 * scan.atsScore) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-xs font-extrabold text-[#dae2fd]">
                        {scan.atsScore}%
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & Summary */}
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        scan.status === 'Passed'
                          ? 'border-[#4edea3] text-[#4edea3] bg-[#4edea3]/10'
                          : scan.status === 'Review'
                          ? 'border-[#d0bcff] text-[#d0bcff] bg-[#d0bcff]/10'
                          : 'border-[#ffb4ab] text-[#ffb4ab] bg-[#ffb4ab]/10'
                      }`}
                    >
                      {scan.status}
                    </span>
                    <p className="text-xs text-[#c7c4d7] line-clamp-2 mt-2 leading-relaxed">
                      {scan.summary}
                    </p>
                  </div>

                  {/* Matched Keywords Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {scan.matchedKeywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#131b2e] text-[#c0c1ff] text-[10px] font-semibold rounded border border-[#464554]/30"
                      >
                        {kw}
                      </span>
                    ))}
                    {scan.matchedKeywords.length > 3 && (
                      <span className="text-[10px] text-[#908fa0] px-1 py-0.5">
                        +{scan.matchedKeywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[#464554]/30">
                  <button
                    onClick={() => onViewScan(scan)}
                    className="px-3 py-1.5 bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Analysis</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadReport(scan)}
                      title="Export PDF Report"
                      className="p-1.5 text-[#4edea3] hover:bg-[#4edea3]/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      title="Delete Scan Record"
                      className="p-1.5 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW FALLBACK */
          <div className="glass-card rounded-2xl border border-[#464554]/30 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#464554]/30 bg-[#131b2e]/60 text-xs font-semibold text-[#908fa0]">
                    <th className="py-3.5 px-4">Document Name</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">ATS Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#464554]/20 text-xs text-[#dae2fd]">
                  {paginatedScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-[#2d3449]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold">{scan.documentName}</td>
                      <td className="py-3.5 px-4 text-[#c7c4d7]">{scan.date}</td>
                      <td className="py-3.5 px-4 font-bold text-[#4edea3]">{scan.atsScore}%</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            scan.status === 'Passed'
                              ? 'border-[#4edea3] text-[#4edea3] bg-[#4edea3]/10'
                              : scan.status === 'Review'
                              ? 'border-[#d0bcff] text-[#d0bcff] bg-[#d0bcff]/10'
                              : 'border-[#ffb4ab] text-[#ffb4ab] bg-[#ffb4ab]/10'
                          }`}
                        >
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => onViewScan(scan)}
                          className="px-2.5 py-1 bg-[#8083ff]/20 text-[#c0c1ff] rounded text-xs font-bold cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onDeleteScan(scan.id)}
                          className="px-2.5 py-1 bg-[#ffb4ab]/20 text-[#ffb4ab] rounded text-xs font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#464554]/30 text-xs text-[#c7c4d7]">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredScans.length)} of {filteredScans.length} scans
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-[#131b2e] border border-[#464554]/40 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[#dae2fd]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-[#131b2e] border border-[#464554]/40 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Confirmation Modal for Resetting History */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#131b2e] border border-[#ffb4ab]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#ffb4ab]">Reset History Confirmation</h3>
            <p className="text-xs text-[#c7c4d7]">
              Are you sure you want to reset scan history back to default sample records? This will clear local browser scan records.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-[#2d3449] text-[#dae2fd] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  if (onResetHistory) onResetHistory();
                }}
                className="px-4 py-2 bg-[#ffb4ab] text-[#60000b] rounded-xl text-xs font-bold"
              >
                Yes, Reset History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
