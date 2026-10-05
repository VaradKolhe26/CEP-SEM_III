import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminAnalytics: React.FC = () => {
  const { scamReports, showToast } = useApp();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');

  const threatTypologies = [
    { type: 'SMS Phishing (Smishing)', count: 42, percent: 38, color: '#006a61' },
    { type: 'Banking & UPI QR Scams', count: 29, percent: 26, color: '#c76c00' },
    { type: 'Fake Tech Support Popups', count: 21, percent: 19, color: '#ba1a1a' },
    { type: 'Email Account Takeover', count: 18, percent: 17, color: '#131b2e' },
  ];

  const weeklyTrends = [
    { day: 'Mon', reports: 12, blocked: 10 },
    { day: 'Tue', reports: 19, blocked: 17 },
    { day: 'Wed', reports: 15, blocked: 14 },
    { day: 'Thu', reports: 26, blocked: 24 },
    { day: 'Fri', reports: 22, blocked: 21 },
    { day: 'Sat', reports: 18, blocked: 16 },
    { day: 'Sun', reports: 14, blocked: 13 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-bold rounded-full uppercase tracking-wider">
            Cyber Threat Intelligence
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            Analytics & Scam Typologies
          </h1>
          <p className="text-sm text-[#45464d]">
            Aggregated trends across reported attack vectors, defense readiness rates, and domain neutralization.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#f7f9fb] p-1 rounded-2xl border border-[#c6c6cd]">
          {(['7D', '30D', '90D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'text-[#45464d] hover:text-[#191c1e]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Attack Frequency Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#191c1e]">
                Threat Incidents vs Neutralized
              </h3>
              <p className="text-xs text-[#76777d]">Daily submission volume and auto-block actions</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#191c1e]">
                <span className="w-3 h-3 rounded-full bg-[#131b2e]"></span>
                <span>Reported</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#006a61]">
                <span className="w-3 h-3 rounded-full bg-[#006a61]"></span>
                <span>Neutralized</span>
              </span>
            </div>
          </div>

          {/* Custom Visual Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-[#eceef0]">
            {weeklyTrends.map((t) => (
              <div key={t.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-48">
                  {/* Reported bar */}
                  <div
                    className="w-4 bg-[#131b2e] rounded-t-lg transition-all group-hover:opacity-80"
                    style={{ height: `${(t.reports / 30) * 100}%` }}
                    title={`${t.reports} reported`}
                  />
                  {/* Neutralized bar */}
                  <div
                    className="w-4 bg-[#006a61] rounded-t-lg transition-all group-hover:opacity-80"
                    style={{ height: `${(t.blocked / 30) * 100}%` }}
                    title={`${t.blocked} neutralized`}
                  />
                </div>
                <span className="text-xs font-bold text-[#76777d]">{t.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-[#76777d]">
            <span>Total Threats Neutralized this period: <strong>110</strong></span>
            <span>Success rate: <strong className="text-[#006a61]">93.2%</strong></span>
          </div>
        </div>

        {/* Threat Typology Breakdown */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-[#191c1e]">Threat Distribution</h3>
            <p className="text-xs text-[#76777d]">Dominant vector categorization</p>
          </div>

          <div className="space-y-4">
            {threatTypologies.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#191c1e] truncate">{item.type}</span>
                  <span className="font-black text-[#006a61]">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#eceef0] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] text-xs space-y-1">
            <span className="font-extrabold text-[#c76c00] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              <span>Key Trend Insight</span>
            </span>
            <p className="text-[#45464d]">
              SMS-based fake bank update links increased by 22% on weekends. Recommended safety alert dispatched to active users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
