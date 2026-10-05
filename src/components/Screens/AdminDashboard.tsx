import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScamReport } from '../../types';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { scamReports, updateReportStatus, setCurrentScreen, usersList, showToast } = useApp();
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const pendingReports = scamReports.filter((r) => r.status === 'Pending');
  const resolvedReports = scamReports.filter((r) => r.status === 'Approved' || r.status === 'Resolved');

  const handleQuickApprove = (report: ScamReport) => {
    updateReportStatus(report.id, 'Approved', 'Verified threat. Added to community blocklist.');
  };

  const handleQuickReject = (report: ScamReport) => {
    updateReportStatus(report.id, 'Rejected', 'Determined safe or benign duplicate.');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#131b2e] text-white p-6 md:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#86f2e4]/20 border border-[#86f2e4]/40 text-[#86f2e4] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#86f2e4] animate-ping"></span>
              <span>Live Threat Monitoring</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Supervisor Threat Center
            </h1>
            <p className="text-xs md:text-sm text-gray-300">
              Real-time cyber protection telemetry, community scam incident triage, and user account integrity metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('admin_requests')}
              className="px-5 py-2.5 bg-[#86f2e4] text-[#006f66] font-bold text-xs rounded-xl hover:bg-[#68e0d1] transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
              <span>Triage Queue ({pendingReports.length})</span>
            </button>
            <button
              onClick={() => showToast('Generated live telemetry report.', 'info')}
              className="px-4 py-2.5 bg-white/10 text-white hover:bg-white/20 border border-white/20 font-bold text-xs rounded-xl transition-all"
            >
              Export Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#76777d] uppercase">Pending Reviews</span>
            <span className="w-10 h-10 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#191c1e]">{pendingReports.length}</h3>
            <p className="text-xs text-[#ba1a1a] font-bold mt-1">Requires immediate triage</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#76777d] uppercase">Protected Users</span>
            <span className="w-10 h-10 rounded-2xl bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#191c1e]">{usersList.length * 180 + 240}</h3>
            <p className="text-xs text-[#006a61] font-bold mt-1">98.4% Active Health</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#76777d] uppercase">Threats Blocked</span>
            <span className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#c76c00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">block</span>
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#191c1e]">{resolvedReports.length + 84}</h3>
            <p className="text-xs text-[#c76c00] font-bold mt-1">Domains neutralized</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#76777d] uppercase">Avg Response Time</span>
            <span className="w-10 h-10 rounded-2xl bg-[#eceef0] text-[#006a61] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#191c1e]">14m</h3>
            <p className="text-xs text-[#006a61] font-bold mt-1">Within SLA targets</p>
          </div>
        </div>
      </div>

      {/* Incident Review Queue Table */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
              Recent Scam & Fraud Submissions
            </h2>
            <p className="text-xs text-[#45464d]">
              Review submissions directly from citizens to confirm phishing threats.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('admin_requests')}
            className="text-xs font-bold text-[#006a61] hover:underline flex items-center gap-1"
          >
            <span>Open Request Center</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eceef0] text-[#76777d] uppercase font-bold text-[11px]">
                <th className="pb-3 px-3">Request ID</th>
                <th className="pb-3 px-3">Citizen</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Summary</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {scamReports.map((report) => (
                <tr key={report.id} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="py-4 px-3 font-bold text-[#191c1e]">{report.reqId}</td>
                  <td className="py-4 px-3">
                    <p className="font-semibold text-[#191c1e]">{report.reportedBy}</p>
                    <p className="text-[10px] text-[#76777d]">{report.dateSubmitted}</p>
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#191c1e] font-bold text-[10px]">
                      {report.category}
                    </span>
                  </td>
                  <td className="py-4 px-3 max-w-xs">
                    <p className="font-semibold text-[#191c1e] truncate">{report.title}</p>
                    <p className="text-[#76777d] truncate text-[11px]">{report.description}</p>
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                        report.priority === 'High'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : report.priority === 'Medium'
                          ? 'bg-[#ffdcc3] text-[#c76c00]'
                          : 'bg-[#eceef0] text-[#76777d]'
                      }`}
                    >
                      {report.priority}
                    </span>
                  </td>
                  <td className="py-4 px-3">
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
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {report.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleQuickApprove(report)}
                            className="p-1.5 bg-[#86f2e4]/40 hover:bg-[#86f2e4] text-[#006f66] rounded-lg transition-colors"
                            title="Confirm Threat & Block"
                          >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                          </button>
                          <button
                            onClick={() => handleQuickReject(report)}
                            className="p-1.5 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] rounded-lg transition-colors"
                            title="Mark Benign"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="p-1.5 bg-[#eceef0] hover:bg-[#c6c6cd] text-[#191c1e] rounded-lg transition-colors"
                            title="Inspect Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-[#76777d]">Processed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Review Modal */}
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
                  <span className="text-[#76777d] font-semibold">Reported By:</span>
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
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Confirmed phishing domain - added to firewall blocklist."
                  className="w-full px-3 py-2 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef0]">
              <button
                onClick={() => {
                  updateReportStatus(selectedReport.id, 'Rejected', reviewNotes);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs rounded-xl hover:bg-[#ffb4ab]"
              >
                Reject / Safe
              </button>
              <button
                onClick={() => {
                  updateReportStatus(selectedReport.id, 'Approved', reviewNotes);
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
