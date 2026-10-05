import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScamReport } from '../../types';

export const AdminRequestCenter: React.FC = () => {
  const { scamReports, updateReportStatus } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const categories = ['All', 'Security', 'Account', 'SMS', 'Website', 'Email'];

  const filteredReports = scamReports.filter((rep) => {
    const matchesCategory = activeCategory === 'All' || rep.category === activeCategory;
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reqId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-2">
        <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-bold rounded-full uppercase tracking-wider">
          Incident Response Triage
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
          Request Center & Scam Queue
        </h1>
        <p className="text-sm text-[#45464d]">
          Review and resolve community-submitted phishing links, fake customer care calls, and fraudulent payment QR codes.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-[#76777d]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Request ID, citizen name, phone, or keyword..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? scamReports.length
                : scamReports.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? 'bg-[#006a61] text-white shadow-xs'
                    : 'bg-[#f7f9fb] text-[#45464d] border border-[#eceef0] hover:bg-[#eceef0]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeCategory === cat ? 'bg-white/20 text-white' : 'bg-[#eceef0] text-[#76777d]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#006a61] bg-[#86f2e4]/30 px-3 py-1 rounded-full">
                  {report.reqId}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      report.priority === 'High'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : report.priority === 'Medium'
                        ? 'bg-[#ffdcc3] text-[#c76c00]'
                        : 'bg-[#eceef0] text-[#76777d]'
                    }`}
                  >
                    {report.priority} Priority
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      report.status === 'Pending'
                        ? 'bg-[#ffdcc3] text-[#c76c00]'
                        : report.status === 'Approved'
                        ? 'bg-[#86f2e4] text-[#006f66]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Title & Reported Info */}
              <div>
                <h3 className="font-bold text-base text-[#191c1e]">{report.title}</h3>
                <p className="text-xs text-[#76777d] mt-0.5">
                  Reported by {report.reportedBy} • {report.dateSubmitted}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-[#45464d] leading-relaxed line-clamp-3 bg-[#f7f9fb] p-3 rounded-xl border border-[#eceef0]">
                {report.description}
              </p>

              {/* Screenshot thumbnail if available */}
              {report.screenshotUrl && (
                <div className="rounded-xl overflow-hidden border border-[#eceef0] h-28 bg-[#f2f4f6]">
                  <img
                    src={report.screenshotUrl}
                    alt="Incident Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-[#eceef0] flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedReport(report)}
                className="px-3 py-2 bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Inspect</span>
              </button>

              {report.status === 'Pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateReportStatus(report.id, 'Rejected', 'Determined safe/non-malicious.')
                    }
                    className="px-3 py-2 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold text-xs rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      updateReportStatus(
                        report.id,
                        'Approved',
                        'Threat verified & auto-block policy enacted.'
                      )
                    }
                    className="px-4 py-2 bg-[#006a61] hover:bg-[#005049] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Confirm & Block
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-[#76777d]">
                  Resolved • {report.adminNotes || 'No notes'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-[#c6c6cd]">
            <div className="flex items-center justify-between pb-4 border-b border-[#eceef0]">
              <div>
                <span className="text-xs font-bold text-[#006a61]">{selectedReport.reqId}</span>
                <h3 className="text-xl font-extrabold text-[#191c1e]">{selectedReport.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-[#76777d] hover:bg-[#eceef0] rounded-full"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#f7f9fb] rounded-xl">
                <div>
                  <span className="text-[#76777d] font-semibold">Citizen:</span>
                  <p className="font-bold text-[#191c1e]">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <span className="text-[#76777d] font-semibold">Channel:</span>
                  <p className="font-bold text-[#191c1e]">{selectedReport.category}</p>
                </div>
              </div>

              <div>
                <span className="text-[#76777d] font-semibold">Full Incident Text:</span>
                <p className="p-3 bg-[#f7f9fb] rounded-xl text-[#191c1e] mt-1 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.screenshotUrl && (
                <div>
                  <span className="text-[#76777d] font-semibold">Attached Evidence:</span>
                  <div className="mt-1 rounded-xl overflow-hidden border border-[#eceef0] max-h-48">
                    <img
                      src={selectedReport.screenshotUrl}
                      alt="Scam Evidence"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#76777d] font-semibold mb-1">
                  Supervisor Notes / Threat Tag:
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Confirmed phishing domain - added to firewall blocklist."
                  className="w-full px-3 py-2 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef0]">
              <button
                onClick={() => {
                  updateReportStatus(selectedReport.id, 'Rejected', adminNote);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs rounded-xl hover:bg-[#ffb4ab]"
              >
                Reject / Safe
              </button>
              <button
                onClick={() => {
                  updateReportStatus(selectedReport.id, 'Approved', adminNote);
                  setSelectedReport(null);
                }}
                className="px-5 py-2 bg-[#006a61] text-white font-bold text-xs rounded-xl hover:bg-[#005049]"
              >
                Confirm Threat & Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
