import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';

type SettingsTab = 'profile' | 'all' | 'access' | 'financial' | 'privacy' | 'devices' | 'emergency';

const PRESET_AVATARS = [
  { id: 'av1', label: 'Tech Professional', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'av2', label: 'Citizen Defender', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'av3', label: 'Senior Citizen', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'av4', label: 'Student / Youth', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'av5', label: 'Cyber Sentinel', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'av6', label: 'Business Owner', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' },
];

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Gujarat',
  'Rajasthan',
  'Telangana',
  'West Bengal',
  'Kerala',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Bihar',
  'Other / Outside India',
];

const OCCUPATION_OPTIONS = [
  'Software / IT Professional',
  'Banking & Financial Services',
  'Senior Citizen / Retired',
  'College Student / Youth',
  'Small Business Owner / Trader',
  'Healthcare & Medical Professional',
  'Government / Civil Services',
  'Educator / Teacher',
  'Homemaker',
  'Other Professional',
];

export const PrivacySettingsScreen: React.FC = () => {
  const {
    currentUser,
    authorizedDevices,
    removeDevice,
    signOutAllOtherDevices,
    updateUserSecuritySettings,
    updateUserProfile,
    purgeLocalDefenseCache,
    exportUserDataArchive,
    toggleFraudLockdown,
    language,
    setLanguage,
    showToast,
  } = useApp();

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Edit Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editCity, setEditCity] = useState(currentUser.city || 'Pune');
  const [editState, setEditState] = useState(currentUser.state || 'Maharashtra');
  const [editOccupation, setEditOccupation] = useState(currentUser.occupation || 'Software Professional');
  const [editBio, setEditBio] = useState(currentUser.bio || 'Committed to cyber fraud awareness and zero-trust digital hygiene.');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser.avatarUrl || PRESET_AVATARS[0].url);

  // Avatar modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Modals state
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showWalkthroughModal, setShowWalkthroughModal] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser.emergencyContactPhone || '+91 98765 43210');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Profile preferences toggles
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [smsScamAlerts, setSmsScamAlerts] = useState(true);
  const [whatsappDigest, setWhatsappDigest] = useState(true);

  // Security score helpers
  const score = currentUser.securityScore || 75;
  const scoreColor =
    score >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-300' :
    score >= 65 ? 'text-amber-800 bg-amber-50 border-amber-300' :
    'text-red-800 bg-red-50 border-red-300';

  const scoreLabel =
    score >= 85 ? 'Hardened Defense (Grade A+)' :
    score >= 65 ? 'Moderate Defense (Grade B)' :
    'Action Required (Vulnerable)';

  const handleStartEditing = () => {
    setEditName(currentUser.name || '');
    setEditPhone(currentUser.phone || '');
    setEditEmail(currentUser.email || '');
    setEditCity(currentUser.city || 'Pune');
    setEditState(currentUser.state || 'Maharashtra');
    setEditOccupation(currentUser.occupation || 'Software Professional');
    setEditBio(currentUser.bio || 'Committed to cyber fraud awareness and zero-trust digital hygiene.');
    setEditAvatarUrl(currentUser.avatarUrl || PRESET_AVATARS[0].url);
    setIsEditingProfile(true);
    setActiveTab('profile');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!editPhone.trim() || editPhone.length < 8) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      occupation: editOccupation.trim(),
      bio: editBio.trim(),
      avatarUrl: editAvatarUrl,
    });

    setIsEditingProfile(false);
  };

  const handleCancelEditing = () => {
    setIsEditingProfile(false);
  };

  const handleBiometricToggle = (enabled: boolean) => {
    if (enabled) {
      setShowBiometricModal(true);
    } else {
      updateUserSecuritySettings({ biometricLock: false });
      showToast('Biometric screen lock disabled.', 'info');
    }
  };

  const confirmBiometricSetup = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      setShowBiometricModal(false);
      updateUserSecuritySettings({ biometricLock: true });
      showToast('Biometric lock verified and enabled successfully!', 'success');
    }, 1200);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      showToast('Security PIN must be exactly 4 digits.', 'error');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('PIN confirmation does not match.', 'error');
      return;
    }
    setShowPinModal(false);
    setNewPin('');
    setConfirmPin('');
    showToast('Secondary 4-digit Security PIN updated successfully.', 'success');
  };

  const handleSaveEmergencyContact = () => {
    if (!emergencyPhone.trim() || emergencyPhone.length < 8) {
      showToast('Please enter a valid emergency phone number.', 'error');
      return;
    }
    updateUserSecuritySettings({ emergencyContactPhone: emergencyPhone });
    setIsEditingPhone(false);
    showToast('Emergency SOS contact updated successfully.', 'success');
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Crisis Lockdown Pulsing Alert if Active */}
      <AnimatePresence>
        {currentUser.fraudLockdownMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 md:p-6 rounded-3xl bg-red-600 text-white shadow-xl border-4 border-red-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center text-2xl font-black shrink-0 animate-pulse">
                🚨
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black tracking-tight">
                  CRISIS LOCKDOWN MODE IS ACTIVE
                </h3>
                <p className="text-xs md:text-sm text-red-100">
                  Sensitive actions and sessions are restricted. If you suspect fraud, call the National Cyber Helpline 1930 immediately.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:1930"
                className="px-4 py-2.5 bg-white text-red-600 font-extrabold text-xs rounded-xl shadow hover:bg-red-50 transition-all flex items-center gap-1.5"
              >
                <span>📞</span>
                <span>Dial 1930</span>
              </a>
              <button
                type="button"
                onClick={toggleFraudLockdown}
                className="px-4 py-2.5 bg-red-800 hover:bg-red-900 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Deactivate Lockdown
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header & Live Security Posture */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Account &amp; Security Hub</span>
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-md flex items-center gap-1">
              <span>🔒</span>
              <span>DPDP Act 2023 Compliant</span>
            </span>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-md">
              Verified Citizen Profile
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            Account, Profile &amp; Privacy Settings
          </h1>
          <p className="text-sm text-[#45464d] leading-relaxed">
            Manage your personal profile identity, contact credentials, biometric locks, financial anti-fraud shields, and data governance controls.
          </p>
        </div>

        {/* Live Defense Gauge Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <div className={`p-4 rounded-2xl border flex items-center gap-4 ${scoreColor} min-w-[240px]`}>
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black">{score}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">/ 100</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                Defense Strength
              </span>
              <p className="font-extrabold text-sm leading-tight">{scoreLabel}</p>
              <div className="w-28 h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-current rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={handleStartEditing}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-[#006a61] hover:bg-[#005049] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Edit Profile"
            >
              <span>✏️</span>
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={exportUserDataArchive}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-[#f7f9fb] hover:bg-[#eceef0] text-[#191c1e] border border-[#c6c6cd] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download your security activity archive"
            >
              <span>📥</span>
              <span>Export Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#eceef0] rounded-2xl w-full overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>👤</span>
          <span>Profile &amp; Identity</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-black">
            Active
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>🛡️</span>
          <span>All Shields &amp; Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('access')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'access'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>🔑</span>
          <span>Access &amp; Biometrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'financial'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>💳</span>
          <span>Financial &amp; UPI Shields</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>👁️</span>
          <span>Privacy &amp; DPDP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'devices'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>📱</span>
          <span>Devices &amp; Sessions</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-bold">
            {authorizedDevices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'emergency'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-[#ba1a1a] hover:bg-red-50'
          }`}
        >
          <span>🚨</span>
          <span>Crisis Freeze (SOS)</span>
        </button>
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="space-y-8">
        {/* SECTION 0: PROFILE & PROFILE SETTINGS & EDIT PROFILE */}
        {(activeTab === 'profile' || activeTab === 'all') && (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#eceef0] pb-6">
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-4 border-[#86f2e4]/40 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#006a61] to-[#86f2e4] text-white flex items-center justify-center font-black text-2xl shadow-md">
                        {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US'}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-[#c6c6cd] shadow-md flex items-center justify-center text-xs hover:bg-[#f7f9fb] transition-all cursor-pointer"
                      title="Change Profile Picture"
                    >
                      📷
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl md:text-2xl font-black text-[#191c1e] tracking-tight">
                        {currentUser.name}
                      </h2>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1">
                        <span>✓</span> Verified Citizen
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-[#76777d] font-medium flex items-center gap-3 flex-wrap">
                      <span>📱 {currentUser.phone}</span>
                      {currentUser.email && <span>• ✉️ {currentUser.email}</span>}
                      <span>• 📍 {currentUser.city || 'Pune'}, {currentUser.state || 'Maharashtra'}</span>
                    </p>
                    <p className="text-xs text-[#006a61] font-bold pt-0.5">
                      💼 {currentUser.occupation || 'Software Professional'} • 🏆 {currentUser.level}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingProfile) {
                        setIsEditingProfile(false);
                      } else {
                        handleStartEditing();
                      }
                    }}
                    className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      isEditingProfile
                        ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        : 'bg-[#006a61] hover:bg-[#005049] text-white'
                    }`}
                  >
                    <span>{isEditingProfile ? '✕' : '✏️'}</span>
                    <span>{isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="flex-1 md:flex-none px-3.5 py-2.5 bg-[#f7f9fb] hover:bg-[#eceef0] text-[#191c1e] border border-[#c6c6cd] rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🖼️</span>
                    <span>Change Avatar</span>
                  </button>
                </div>
              </div>

              {/* Bio Statement Display */}
              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] space-y-1">
                <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                  Citizen Cyber Defense Mission Statement:
                </span>
                <p className="text-xs md:text-sm text-[#191c1e] font-medium leading-relaxed italic">
                  "{currentUser.bio || 'Committed to cyber fraud awareness, zero-trust digital hygiene, and protecting my family from scam traps.'}"
                </p>
              </div>

              {/* Quick Profile Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white border border-[#eceef0] shadow-2xs space-y-0.5">
                  <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
                    Security Score
                  </span>
                  <p className="text-lg font-black text-[#006a61]">{currentUser.securityScore} / 100</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#eceef0] shadow-2xs space-y-0.5">
                  <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
                    Completed Lessons
                  </span>
                  <p className="text-lg font-black text-[#191c1e]">
                    {currentUser.completedModules} / {currentUser.totalModules || 5}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#eceef0] shadow-2xs space-y-0.5">
                  <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
                    Active Devices
                  </span>
                  <p className="text-lg font-black text-[#191c1e]">{authorizedDevices.length} Sessions</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#eceef0] shadow-2xs space-y-0.5">
                  <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
                    Account Status
                  </span>
                  <p className="text-lg font-black text-emerald-700">{currentUser.status || 'Active'}</p>
                </div>
              </div>
            </div>

            {/* EDIT PROFILE FORM (Toggleable In-Place) */}
            <AnimatePresence>
              {isEditingProfile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#006a61] shadow-lg space-y-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[#eceef0] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✏️</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-extrabold text-[#191c1e]">
                          Edit Profile Details
                        </h3>
                        <p className="text-xs text-[#76777d]">
                          Update your personal information, location, and cyber defense persona.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Avatar Picker Row */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#191c1e] uppercase tracking-wider block">
                        Choose Profile Avatar:
                      </label>
                      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setEditAvatarUrl(av.url)}
                            className={`p-1 rounded-2xl border-2 transition-all shrink-0 cursor-pointer ${
                              editAvatarUrl === av.url
                                ? 'border-[#006a61] scale-105 shadow-md ring-2 ring-[#006a61]/20'
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <img
                              src={av.url}
                              alt={av.label}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#191c1e] block">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#191c1e] block">
                          Registered Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white font-mono"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#191c1e] block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="rahul.s@example.com"
                          className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
                        />
                      </div>

                      {/* Occupation */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#191c1e] block">
                          Occupation / Persona
                        </label>
                        <select
                          value={editOccupation}
                          onChange={(e) => setEditOccupation(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
                        >
                          {OCCUPATION_OPTIONS.map((occ, idx) => (
                            <option key={idx} value={occ}>
                              {occ}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#191c1e] block">
                          City / District
                        </label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder="e.g. Pune, Mumbai, Bengaluru"
                          className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
                        />
                      </div>

                      {/* State */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#191c1e] block">
                          State / Union Territory
                        </label>
                        <select
                          value={editState}
                          onChange={(e) => setEditState(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
                        >
                          {INDIAN_STATES.map((st, idx) => (
                            <option key={idx} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Bio Statement */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#191c1e] block">
                        Personal Cyber Defense Bio / Note:
                      </label>
                      <textarea
                        rows={2}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Write a brief note about your security focus..."
                        className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
                      />
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelEditing}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#006a61] hover:bg-[#005049] text-xs font-extrabold text-white shadow-md transition-all cursor-pointer"
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Preferences & Communication Channels */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-[#eceef0] pb-4">
                <span className="text-xl">⚙️</span>
                <div>
                  <h3 className="text-lg font-extrabold text-[#191c1e]">
                    Profile Preferences &amp; Notification Channels
                  </h3>
                  <p className="text-xs text-[#76777d]">
                    Manage how your profile is displayed and how SafeGuard sends emergency security alerts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Language Preference */}
                <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs md:text-sm text-[#191c1e]">
                      Preferred Interface Language
                    </h4>
                    <p className="text-xs text-[#76777d]">
                      Set the display language across all lessons, simulator scenarios, and alerts.
                    </p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="px-3 py-1.5 bg-white border border-[#c6c6cd] rounded-xl text-xs font-bold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] shrink-0"
                  >
                    <option value="en">English (EN)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                {/* Public Leaderboard Visibility */}
                <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs md:text-sm text-[#191c1e]">
                      Public Cyber Leaderboard Badge
                    </h4>
                    <p className="text-xs text-[#76777d]">
                      Display your completed learning badges on the community defense board.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={publicLeaderboard}
                      onChange={(e) => setPublicLeaderboard(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                  </label>
                </div>

                {/* Urgent SMS Scam Alerts */}
                <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs md:text-sm text-[#191c1e]">
                      Urgent SMS Fraud Flash Alerts
                    </h4>
                    <p className="text-xs text-[#76777d]">
                      Receive text alerts when widespread SMS bank phishing campaigns are detected.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={smsScamAlerts}
                      onChange={(e) => setSmsScamAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                  </label>
                </div>

                {/* Weekly WhatsApp Security Digest */}
                <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs md:text-sm text-[#191c1e]">
                      Weekly Cyber Digest on WhatsApp
                    </h4>
                    <p className="text-xs text-[#76777d]">
                      Receive curated weekly anti-fraud case studies and RBI updates via WhatsApp.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={whatsappDigest}
                      onChange={(e) => setWhatsappDigest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: Account Information & Credentials */}
        {(activeTab === 'all' || activeTab === 'access') && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eceef0] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
                  Account Identity &amp; Credential Security
                </h2>
                <p className="text-xs text-[#45464d]">
                  Verified identity details linked to your citizen cybersecurity profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="px-4 py-2 bg-[#86f2e4]/30 hover:bg-[#86f2e4]/50 text-[#006f66] font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer w-fit"
              >
                <span>🔑</span>
                <span>Change 4-Digit Security PIN</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] space-y-1">
                <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                  Registered Name
                </span>
                <p className="font-extrabold text-base text-[#191c1e]">{currentUser.name}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                  <span>✓</span> Verified Citizen
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] space-y-1">
                <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                  Registered Mobile
                </span>
                <p className="font-extrabold text-base text-[#191c1e]">{currentUser.phone}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#006a61] font-bold">
                  <span>📶</span> SIM Sentinel Active
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] space-y-1">
                <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                  Defender Tier
                </span>
                <p className="font-extrabold text-base text-[#191c1e]">{currentUser.level}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#c76c00] font-bold">
                  <span>⭐</span> {currentUser.completedModules} Lessons Mastered
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Access & Authentication Controls */}
        {(activeTab === 'all' || activeTab === 'access') && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
                Authentication &amp; Access Protections
              </h2>
              <p className="text-xs text-[#45464d]">
                Harden how you sign into SafeGuard and restrict access when your device is unattended.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Two-Factor Authentication (2FA) */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📲</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Two-Factor Authentication (2FA)
                    </h4>
                    {currentUser.mfaEnabled && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        ACTIVE (+12 pts)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Require an SMS OTP or Authenticator app token whenever signing in from a new or unverified device.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.mfaEnabled}
                    onChange={(e) => updateUserSecuritySettings({ mfaEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* Biometric & WebAuthn Screen Lock */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👆</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Biometric App &amp; Screen Lock
                    </h4>
                    {currentUser.biometricLock && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        ACTIVE (+10 pts)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Prompt for fingerprint, Face ID, or system passcode before opening private defense chats or sensitive reports.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={!!currentUser.biometricLock}
                    onChange={(e) => handleBiometricToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* Session Inactivity Timeout */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Inactivity Auto-Lock Timeout
                    </h4>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Automatically lock the app session after a period of user inactivity to prevent shoulder surfing.
                  </p>
                  <div className="pt-1">
                    <select
                      value={currentUser.autoLockMinutes ?? 15}
                      onChange={(e) =>
                        updateUserSecuritySettings({ autoLockMinutes: parseInt(e.target.value, 10) })
                      }
                      className="px-3 py-1.5 bg-white border border-[#c6c6cd] rounded-xl text-xs font-bold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61]"
                    >
                      <option value={5}>5 Minutes (Maximum Security)</option>
                      <option value={15}>15 Minutes (Recommended)</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                      <option value={0}>Disabled (Not Recommended)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Real-Time Login Threat Alerts */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔔</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Login &amp; Threat Proximity Alerts
                    </h4>
                    {currentUser.loginAlerts && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        ACTIVE (+5 pts)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Receive instant push &amp; SMS alerts if an unrecognized device logs in or urgent phishing campaigns strike your area.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.loginAlerts}
                    onChange={(e) => updateUserSecuritySettings({ loginAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Financial & Anti-Fraud Cyber Shields */}
        {(activeTab === 'all' || activeTab === 'financial') && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eceef0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
                    Financial &amp; UPI Cyber Shields
                  </h2>
                </div>
                <p className="text-xs text-[#45464d]">
                  Active defense mechanisms designed specifically against Indian banking, UPI, and SIM-swap fraud vectors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWalkthroughModal(true)}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer w-fit"
              >
                <span>💡</span>
                <span>Bank Card Controls Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* UPI Deep-Link & Clipboard Guard */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      UPI Deep-Link &amp; Clipboard Sandbox
                    </h4>
                    {currentUser.upiSafetyShield && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        PROTECTED (+10 pts)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Scans and intercepts unauthorized background clipboard reading to prevent malicious apps from copying your OTP or UPI handle.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.upiSafetyShield !== false}
                    onChange={(e) => updateUserSecuritySettings({ upiSafetyShield: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* SIM Swap & Carrier Sentinel */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📶</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      SIM Swap &amp; Carrier Sentinel
                    </h4>
                    {currentUser.simSwapAlerts && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        ACTIVE (+8 pts)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Monitors carrier telemetry for unauthorized duplicate SIM reissue or eSIM profile transfer attempts linked to your phone number.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.simSwapAlerts !== false}
                    onChange={(e) => updateUserSecuritySettings({ simSwapAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* Phishing URL Heuristic Quarantine */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Phishing URL Quarantine &amp; Sandbox
                    </h4>
                    {currentUser.phishingLinkQuarantine && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        ACTIVE (+8 pts)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Automatically checks links in incoming messages against malicious APK repositories (.apk, .top, .xyz) before preview.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.phishingLinkQuarantine !== false}
                    onChange={(e) => updateUserSecuritySettings({ phishingLinkQuarantine: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* International Card Usage Lock Reminder */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <h4 className="font-extrabold text-sm text-amber-950">
                      International Card Controls Check
                    </h4>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full">
                      RBI Recommendation
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    Always keep "International Usage" toggled OFF in your banking app (SBI YONO, HDFC MyCards, ICICI) to block overseas unauthorized card debits.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowWalkthroughModal(true)}
                    className="text-xs font-extrabold text-[#006a61] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>Read Step-by-Step Instructions</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Privacy & Data Governance (DPDP Act 2023) */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">👁️</span>
                <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
                  Privacy &amp; Data Governance
                </h2>
              </div>
              <p className="text-xs text-[#45464d]">
                Control how your telemetry is handled in compliance with India's Digital Personal Data Protection (DPDP) Act 2023.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mask PII in Community Scam Reports */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎭</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Mask PII in Public Scam Submissions
                    </h4>
                    {currentUser.maskPersonalDataInReports && (
                      <span className="px-2 py-0.5 bg-[#86f2e4] text-[#006f66] text-[10px] font-bold rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Automatically redact phone numbers, account numbers, and personal names into anonymous handles (e.g. Citizen#4921) when sharing reports.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.maskPersonalDataInReports !== false}
                    onChange={(e) =>
                      updateUserSecuritySettings({ maskPersonalDataInReports: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* Anonymous Threat Telemetry Sharing */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤝</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Anonymous Community Threat Telemetry
                    </h4>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Contribute sanitized threat URLs anonymously to improve local community defense heuristics without sharing personal info.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentUser.dataSharing}
                    onChange={(e) => updateUserSecuritySettings({ dataSharing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
                </label>
              </div>

              {/* Data Portability Download */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📦</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Download Security Data Archive
                    </h4>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Export your complete learning history, audit logs, and authorized sessions in machine-readable JSON under DPDP Act rights.
                  </p>
                  <button
                    type="button"
                    onClick={exportUserDataArchive}
                    className="mt-2 px-3 py-1.5 bg-[#006a61] hover:bg-[#005049] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>📥</span>
                    <span>Download (.JSON)</span>
                  </button>
                </div>
              </div>

              {/* Purge Local Defense Cache */}
              <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧹</span>
                    <h4 className="font-extrabold text-sm text-[#191c1e]">
                      Purge Local Defense Cache &amp; History
                    </h4>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Clear locally saved search queries, analyzer drafts, and simulation attempts stored on this device.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPurgeModal(true)}
                    className="mt-2 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🗑️</span>
                    <span>Clear Local Cache</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: Authorized Devices & Active Sessions */}
        {(activeTab === 'all' || activeTab === 'devices') && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eceef0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
                    Authorized Devices &amp; Active Sessions
                  </h2>
                </div>
                <p className="text-xs text-[#45464d]">
                  Review and revoke logged-in sessions across your smartphones, tablets, and computers.
                </p>
              </div>

              <button
                type="button"
                onClick={signOutAllOtherDevices}
                className="px-4 py-2 text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] hover:bg-[#ffb4ab] rounded-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 w-fit"
              >
                <span>🚪</span>
                <span>Sign Out All Other Devices</span>
              </button>
            </div>

            {/* Geofence Lockdown Toggle */}
            <div className="p-4 rounded-2xl bg-[#86f2e4]/15 border border-[#86f2e4]/60 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <h4 className="font-extrabold text-xs md:text-sm text-[#006f66]">
                    Unknown Geolocation &amp; VPN Lockdown
                  </h4>
                  {currentUser.unknownDeviceLockdown && (
                    <span className="px-2 py-0.5 bg-[#006a61] text-white text-[9px] font-black rounded-full">
                      ACTIVE (+7 pts)
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#45464d]">
                  Automatically challenge or block login attempts initiated outside your typical geographic region or from untrusted VPN nodes.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={currentUser.unknownDeviceLockdown !== false}
                  onChange={(e) =>
                    updateUserSecuritySettings({ unknownDeviceLockdown: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a61]"></div>
              </label>
            </div>

            {/* Devices List */}
            <div className="space-y-3">
              {authorizedDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-between gap-4 hover:border-[#c6c6cd] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#c6c6cd] flex items-center justify-center text-xl text-[#006a61] shadow-2xs">
                      {dev.deviceName.toLowerCase().includes('phone') ? '📱' : '💻'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#191c1e]">{dev.deviceName}</h4>
                        {dev.isCurrent && (
                          <span className="px-2 py-0.5 bg-[#86f2e4] text-[#006f66] text-[10px] font-black rounded-full">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#76777d] mt-0.5">
                        {dev.browser} • {dev.location} • <span className="font-medium">{dev.lastActive}</span>
                      </p>
                    </div>
                  </div>

                  {!dev.isCurrent && (
                    <button
                      type="button"
                      onClick={() => removeDevice(dev.id)}
                      className="p-2 text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                      title="Revoke Device Access"
                    >
                      <span>✕</span>
                      <span className="hidden sm:inline">Revoke</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Emergency Panic Lockdown & Crisis Freeze (SOS) */}
        {(activeTab === 'all' || activeTab === 'emergency') && (
          <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-6 md:p-8 border-2 border-red-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  <h2 className="text-xl font-extrabold text-red-950 tracking-tight">
                    Emergency Crisis Freeze &amp; SOS Lockdown
                  </h2>
                </div>
                <p className="text-xs text-red-900/80 leading-relaxed">
                  If you suspect your device was compromised, an unauthorized transaction was initiated, or your phone was stolen, trigger lockdown immediately.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFraudLockdown}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    currentUser.fraudLockdownMode
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  }`}
                >
                  <span>{currentUser.fraudLockdownMode ? '✓' : '🚨'}</span>
                  <span>{currentUser.fraudLockdownMode ? 'Deactivate Lockdown' : 'Activate Panic Lockdown'}</span>
                </button>
              </div>
            </div>

            {/* Emergency Hotline & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700">
                    National Helpline (24x7)
                  </span>
                  <span className="text-xs bg-red-100 text-red-800 font-black px-2 py-0.5 rounded-full">
                    MHA / I4C
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#191c1e]">Call 1930 (Golden Hour)</h4>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Freeze funds in the scammer's beneficiary bank account before they withdraw cash from an ATM.
                </p>
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ba1a1a] text-white font-extrabold text-xs rounded-xl hover:bg-red-800 transition-all cursor-pointer"
                >
                  <span>📞</span>
                  <span>Dial 1930 Toll-Free</span>
                </a>
              </div>

              {/* Emergency Contact Phone */}
              <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                    Trusted Family SOS Contact
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                    className="text-xs font-bold text-[#006a61] hover:underline cursor-pointer"
                  >
                    {isEditingPhone ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {isEditingPhone ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="px-3 py-1.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs font-bold text-[#191c1e] w-full"
                    />
                    <button
                      type="button"
                      onClick={handleSaveEmergencyContact}
                      className="px-3 py-1.5 bg-[#006a61] text-white font-bold text-xs rounded-xl hover:bg-[#005049] transition-all cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="text-lg font-black text-[#191c1e]">{emergencyPhone}</h4>
                    <p className="text-xs text-[#45464d] leading-relaxed">
                      This number is alerted with an automated SMS containing your location and account freeze notice during crisis mode.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 0: Change Profile Picture / Avatar Picker */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#eceef0] pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🖼️</span>
                  <div>
                    <h3 className="text-lg font-black text-[#191c1e]">Choose Profile Picture</h3>
                    <p className="text-xs text-[#76777d]">Select an avatar or paste a custom image URL.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Current Preview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0]">
                <img
                  src={editAvatarUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#006a61] shadow-sm"
                />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
                    Current Selection
                  </span>
                  <p className="font-extrabold text-sm text-[#191c1e]">{currentUser.name}</p>
                  <p className="text-xs text-[#006a61] font-bold">{currentUser.level}</p>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#191c1e] uppercase tracking-wider block">
                  Preset Defender Avatars:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setEditAvatarUrl(av.url)}
                      className={`p-1 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        editAvatarUrl === av.url
                          ? 'border-[#006a61] bg-[#86f2e4]/15 shadow-sm'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <span className="text-[9px] font-bold text-[#76777d] truncate max-w-full">
                        {av.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#191c1e] block">
                  Or Paste Custom Image URL:
                </label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full px-4 py-2 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#006a61]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateUserProfile({ avatarUrl: editAvatarUrl });
                    setShowAvatarModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#006a61] hover:bg-[#005049] text-xs font-extrabold text-white shadow transition-all cursor-pointer"
                >
                  Save Avatar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 1: Biometric Setup Simulation */}
      <AnimatePresence>
        {showBiometricModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center text-3xl font-black mx-auto">
                {isBiometricScanning ? '🔄' : '👆'}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#191c1e]">
                  {isBiometricScanning ? 'Scanning Biometrics...' : 'Enable Biometric & Screen Lock'}
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  SafeGuard uses your device's hardware security enclave (Touch ID, Face ID, or Windows Hello) to protect sensitive defense logs and personal chats.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] text-xs text-[#006f66] font-bold flex items-center justify-center gap-2">
                <span>🔒</span>
                <span>Hardware Enclave Simulation Ready</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowBiometricModal(false)}
                  disabled={isBiometricScanning}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmBiometricSetup}
                  disabled={isBiometricScanning}
                  className="flex-1 py-3 rounded-xl bg-[#006a61] hover:bg-[#005049] text-xs font-extrabold text-white shadow-md transition-all cursor-pointer"
                >
                  {isBiometricScanning ? 'Verifying...' : 'Touch Sensor / Scan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Change 4-Digit Security PIN */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#eceef0] pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔑</span>
                  <h3 className="text-lg font-black text-[#191c1e]">Set 4-Digit Security PIN</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#191c1e] block">
                    Enter New 4-Digit PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full text-center tracking-widest text-2xl py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#006a61]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#191c1e] block">
                    Confirm 4-Digit PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full text-center tracking-widest text-2xl py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#006a61]"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Important:</strong> Never reuse your bank ATM PIN or UPI PIN as your app security PIN.
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#006a61] hover:bg-[#005049] text-xs font-extrabold text-white shadow transition-all cursor-pointer"
                  >
                    Save Security PIN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Purge Cache Confirmation */}
      <AnimatePresence>
        {showPurgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mx-auto">
                🧹
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#191c1e]">Purge Local Defense Cache?</h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  This will clear temporary heuristic analysis inputs, offline cached scenarios, and local storage tokens stored on this browser. Your completed modules and account credentials will remain safe.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPurgeModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    purgeLocalDefenseCache();
                    setShowPurgeModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-red-800 text-xs font-bold text-white shadow transition-all cursor-pointer"
                >
                  Confirm &amp; Purge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Emergency Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-red-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-black shrink-0">
                  🚨
                </div>
                <div>
                  <h3 className="text-xl font-black text-red-950">Activate Panic Crisis Mode?</h3>
                  <p className="text-xs text-red-800">Immediate containment for compromised accounts.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#45464d] leading-relaxed">
                <p className="font-semibold text-slate-800">
                  When Panic Mode is activated:
                </p>
                <ul className="space-y-2 list-disc pl-4">
                  <li>Active sessions on all other phones and computers are instantly terminated.</li>
                  <li>Direct links and phone dialing for the <strong>1930 Cyber Crime Helpline</strong> are pinned to the top of your screen.</li>
                  <li>Emergency SMS alert template is prepared for your trusted contact ({emergencyPhone}).</li>
                  <li>Sensitive account modifications and profile exports are temporarily frozen.</li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCrisisModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleFraudLockdown();
                    setShowCrisisModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black text-white shadow-lg transition-all cursor-pointer"
                >
                  Confirm Panic Lockdown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: Banking Card Controls Walkthrough */}
      <AnimatePresence>
        {showWalkthroughModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#eceef0] pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  <h3 className="text-lg font-black text-[#191c1e]">
                    Banking Card Controls Walkthrough
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWalkthroughModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-[#45464d] leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <h4 className="font-extrabold text-amber-950">Why This Matters:</h4>
                  <p className="text-amber-900 font-medium">
                    Over 65% of unauthorized international debit/credit card frauds happen because international e-commerce channels do not require an Indian OTP.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-extrabold text-xs text-[#191c1e] uppercase tracking-wider">
                    How to Turn Off International Usage (Takes 60 seconds):
                  </h5>
                  <ol className="space-y-2 list-decimal pl-4 font-medium">
                    <li>
                      Open your bank's official app: <strong>SBI YONO</strong> (Cards ➔ Manage Cards), <strong>HDFC Bank / MyCards</strong>, or <strong>ICICI iMobile</strong>.
                    </li>
                    <li>
                      Tap on <strong>Manage Card Limits &amp; Channels</strong>.
                    </li>
                    <li>
                      Find <strong>International Usage (Online, POS, ATM)</strong> and toggle it <strong>OFF</strong>.
                    </li>
                    <li>
                      Set domestic online e-commerce transaction limits to a modest threshold (e.g. ₹5,000 or ₹10,000) instead of default ₹1,00,000.
                    </li>
                  </ol>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWalkthroughModal(false)}
                className="w-full py-3 rounded-xl bg-[#006a61] hover:bg-[#005049] text-xs font-black text-white shadow transition-all cursor-pointer"
              >
                Understood &amp; Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
