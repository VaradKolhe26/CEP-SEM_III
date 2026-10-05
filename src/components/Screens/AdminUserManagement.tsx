import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

export const AdminUserManagement: React.FC = () => {
  const { usersList, updateUserStatus, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Pending Review'>('All');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const filteredUsers = usersList.filter((u) => {
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-2">
        <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-bold rounded-full uppercase tracking-wider">
          Citizen Accounts
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
          User Management & Safety Roster
        </h1>
        <p className="text-sm text-[#45464d]">
          Monitor user cyber security proficiency levels, manage access permissions, and investigate compromised accounts.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-sm space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-[#76777d]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search citizen by name, phone, or email..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Active', 'Suspended', 'Pending Review'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'bg-[#f7f9fb] text-[#45464d] border border-[#eceef0] hover:bg-[#eceef0]'
              }`}
            >
              {st} ({st === 'All' ? usersList.length : usersList.filter((u) => u.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eceef0] text-[#76777d] uppercase font-bold text-[11px]">
                <th className="pb-3 px-3">Citizen Name & ID</th>
                <th className="pb-3 px-3">Contact</th>
                <th className="pb-3 px-3">Security Level</th>
                <th className="pb-3 px-3">Defense Score</th>
                <th className="pb-3 px-3">Modules Completed</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="py-4 px-3">
                    <p className="font-bold text-sm text-[#191c1e]">{user.name}</p>
                    <p className="text-[10px] text-[#76777d]">{user.id}</p>
                  </td>
                  <td className="py-4 px-3">
                    <p className="font-semibold text-[#191c1e]">{user.phone}</p>
                    <p className="text-[10px] text-[#76777d]">{user.email || 'No email'}</p>
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#006a61] font-bold text-[10px]">
                      {user.level}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-[#006a61]">{user.securityScore}%</span>
                      <div className="w-16 bg-[#eceef0] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#006a61] h-1.5 rounded-full"
                          style={{ width: `${user.securityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-bold text-[#191c1e]">
                      {user.completedModules} / {user.totalModules}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        user.status === 'Active'
                          ? 'bg-[#86f2e4] text-[#006f66]'
                          : user.status === 'Suspended'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#ffdcc3] text-[#c76c00]'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {user.status === 'Active' ? (
                        <button
                          onClick={() => updateUserStatus(user.id, 'Suspended')}
                          className="px-2.5 py-1 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold text-[11px] rounded-lg transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user.id, 'Active')}
                          className="px-2.5 py-1 bg-[#86f2e4] hover:bg-[#68e0d1] text-[#006f66] font-bold text-[11px] rounded-lg transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => {
                          showToast(`PIN reset instructions sent to ${user.phone}`, 'info');
                        }}
                        className="p-1.5 text-[#76777d] hover:bg-[#eceef0] rounded-lg"
                        title="Send PIN Reset"
                      >
                        <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
