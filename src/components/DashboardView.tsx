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
  RotateCcw
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
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

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
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#dae2fd] mb-2 font-headline">
          Dashboard Overview
        </h1>
        <p className="text-[#c7c4d7] text-base">
          Monitor your resume optimization progress and review past analysis.
        </p>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 flex items-center justify-between hover:glow-accent transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-1">
              Total Analyzed
            </p>
            <p className="text-3xl font-bold text-[#dae2fd]">{stats.totalAnalyzed}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex items-center justify-between hover:glow-accent transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-1">
              Avg ATS Score
            </p>
            <p className="text-3xl font-bold text-[#4edea3]">{stats.avgAtsScore}%</p>
          </div>
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#8083ff ${stats.avgAtsScore * 3.6}deg, #1d2538 0deg)`
            }}
          >
            <div className="w-9 h-9 bg-[#0b1326] rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#4edea3]" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex items-center justify-between hover:glow-accent transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-1">
              AI Rewrites Used
            </p>
            <p className="text-3xl font-bold text-[#d0bcff]">{stats.aiRewritesUsed}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#571bc1]/20 flex items-center justify-center text-[#d0bcff]">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* History Table Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-[#dae2fd]">Scan History</h2>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#908fa0] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#171f33] border border-[#464554]/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>

            {onResetHistory && (
              <button
                onClick={() => setShowConfirmReset(true)}
                title="Reset Scan History"
                className="bg-[#2d3449] hover:bg-[#31394d] text-[#ffb4ab] border border-[#ffb4ab]/40 px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset History</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-[#c0c1ff] text-[#0d0096] px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 hover:glow-accent transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#1d2538] border border-[#464554] rounded-xl shadow-2xl p-2 z-20 animate-fade-in space-y-1">
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                      filterStatus === 'all'
                        ? 'bg-[#8083ff]/30 text-[#c0c1ff]'
                        : 'text-[#c7c4d7] hover:bg-[#2d3449]'
                    }`}
                  >
                    All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('passed');
                      setFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                      filterStatus === 'passed'
                        ? 'bg-[#4edea3]/20 text-[#4edea3]'
                        : 'text-[#c7c4d7] hover:bg-[#2d3449]'
                    }`}
                  >
                    Passed (80%+)
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('review');
                      setFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                      filterStatus === 'review'
                        ? 'bg-[#d0bcff]/20 text-[#d0bcff]'
                        : 'text-[#c7c4d7] hover:bg-[#2d3449]'
                    }`}
                  >
                    Review (70-79%)
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('fixesneeded');
                      setFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                      filterStatus === 'fixesneeded'
                        ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                        : 'text-[#c7c4d7] hover:bg-[#2d3449]'
                    }`}
                  >
                    Fixes Needed (&lt;70%)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal for Reset History */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#131b2e] border border-[#ffb4ab]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <h3 className="text-lg font-bold text-[#dae2fd] flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-[#ffb4ab]" />
                <span>Reset Scan History?</span>
              </h3>
              <p className="text-xs text-[#c7c4d7] leading-relaxed">
                This will reset your stored scan history back to default sample records and clear browser cache. Are you sure?
              </p>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2 bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmReset(false);
                    onResetHistory?.();
                  }}
                  className="px-4 py-2 bg-[#ffb4ab]/20 hover:bg-[#ffb4ab]/30 text-[#ffb4ab] border border-[#ffb4ab]/50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Reset History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="glass-card rounded-xl overflow-hidden w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#464554]/30 bg-[#222a3d]/50 text-xs text-[#c7c4d7] font-medium uppercase tracking-wider">
                <th className="p-4 font-medium">Document Name</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">ATS Score</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#dae2fd] divide-y divide-[#464554]/20">
              {scans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#dae2fd]">No Resumes Analyzed Yet</h3>
                      <p className="text-xs text-[#c7c4d7] max-w-sm">
                        Upload your first resume in the Scanner to unlock real-time Gemini AI scoring, keyword matching, and bullet rewrites.
                      </p>
                      <button
                        onClick={onNavigateScanner}
                        className="mt-2 px-4 py-2 bg-[#8083ff] text-[#0d0096] font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span>Analyze First Resume</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedScans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#908fa0]">
                    No scan history entries match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-[#2d3449]/30 transition-colors group cursor-pointer"
                  >
                    <td
                      onClick={() => onViewScan(scan)}
                      className="p-4 flex items-center space-x-3"
                    >
                      <FileText className="w-5 h-5 text-[#908fa0] group-hover:text-[#c0c1ff] transition-colors" />
                      <span className="font-semibold text-[#e1e0ff] hover:underline">
                        {scan.documentName}
                      </span>
                    </td>
                    <td onClick={() => onViewScan(scan)} className="p-4 text-[#c7c4d7]">
                      {scan.date}
                    </td>
                    <td onClick={() => onViewScan(scan)} className="p-4">
                      <span
                        className={`font-bold ${
                          scan.atsScore >= 80
                            ? 'text-[#4edea3]'
                            : scan.atsScore >= 70
                            ? 'text-[#e9ddff]'
                            : 'text-[#ffb4ab]'
                        }`}
                      >
                        {scan.atsScore}%
                      </span>
                    </td>
                    <td onClick={() => onViewScan(scan)} className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
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
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewScan(scan)}
                          title="View Results"
                          className="p-1.5 text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors rounded-md hover:bg-[#2d3449] cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(scan)}
                          title="Export PDF Report"
                          className="p-1.5 text-[#c7c4d7] hover:text-[#4edea3] transition-colors rounded-md hover:bg-[#2d3449] cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteScan(scan.id)}
                          title="Delete Scan"
                          className="p-1.5 text-[#c7c4d7] hover:text-[#ffb4ab] transition-colors rounded-md hover:bg-[#2d3449] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-[#c7c4d7] gap-3">
          <button
            onClick={onNavigateScanner}
            className="text-[#c0c1ff] font-medium hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>+ Scan New Resume Document</span>
          </button>

          <div className="flex items-center space-x-3">
            <span>
              Showing {filteredScans.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filteredScans.length)} of {filteredScans.length} scans (Page {currentPage} of {totalPages})
            </span>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 text-[#c0c1ff] hover:text-white disabled:text-[#908fa0] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 text-[#c0c1ff] hover:text-white disabled:text-[#908fa0] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
