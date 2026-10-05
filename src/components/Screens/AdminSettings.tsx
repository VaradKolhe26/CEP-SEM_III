import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { systemSettings, updateSettings, showToast } = useApp();
  const [platformName, setPlatformName] = useState(systemSettings.platformName);
  const [adminEmail, setAdminEmail] = useState(systemSettings.adminEmail);
  const [dailySummary, setDailySummary] = useState(systemSettings.dailySummaryEmails);
  const [criticalAlerts, setCriticalAlerts] = useState(systemSettings.criticalSecurityAlerts);
  const [sessionTimeout, setSessionTimeout] = useState(systemSettings.sessionTimeoutMinutes);
  const [authReq, setAuthReq] = useState(systemSettings.authRequirement);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platformName,
      adminEmail,
      dailySummaryEmails: dailySummary,
      criticalSecurityAlerts: criticalAlerts,
      sessionTimeoutMinutes: Number(sessionTimeout),
      authRequirement: authReq,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-2">
        <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-bold rounded-full uppercase tracking-wider">
          System Configuration
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
          Admin Settings & Platform Policies
        </h1>
        <p className="text-sm text-[#45464d]">
          Configure default safety policies, MFA enforcement, and automated notification alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
            Platform Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
                System Brand Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
                Supervisor Dispatch Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Security Policies Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
            Security Enforcement Policies
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0]">
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">Enforce Multi-Factor (MFA) on All Admins</h4>
                <p className="text-xs text-[#45464d]">
                  Requires TOTP authenticator validation on every supervisor login session.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#86f2e4] text-[#006f66] font-bold text-xs rounded-full">
                ENFORCED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0]">
                <label className="block text-xs font-bold text-[#191c1e] mb-1 uppercase">
                  Session Inactivity Timeout (Mins)
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#c6c6cd] rounded-xl text-xs font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0]">
                <label className="block text-xs font-bold text-[#191c1e] mb-1 uppercase">
                  Authentication Policy
                </label>
                <select
                  value={authReq}
                  onChange={(e) => setAuthReq(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#c6c6cd] rounded-xl text-xs font-bold"
                >
                  <option value="mfa">MFA Recommended</option>
                  <option value="password_only">PIN / Password Standard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Digest Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
            Notification Dispatches
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0]">
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">Daily Incident Summary Email</h4>
                <p className="text-xs text-[#45464d]">
                  Receive an automated recap at 08:00 AM of newly flagged malicious domains.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailySummary}
                  onChange={(e) => setDailySummary(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0]">
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">Critical Security Alerts Dispatch</h4>
                <p className="text-xs text-[#45464d]">
                  Instant SMS alert for high-severity phishing campaigns affecting &gt;50 citizens.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={criticalAlerts}
                  onChange={(e) => setCriticalAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#006a61] text-white font-bold text-sm rounded-2xl hover:bg-[#005049] transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
