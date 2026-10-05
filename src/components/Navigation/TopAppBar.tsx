import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';

interface TopAppBarProps {
  onToggleMobileMenu?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onToggleMobileMenu }) => {
  const {
    currentScreen,
    setCurrentScreen,
    currentUser,
    switchRole,
    scamReports,
    showToast,
    isSidebarOpen,
    toggleSidebar,
  } = useApp();

  const { t } = useTranslation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pendingReports = scamReports.filter((r) => r.status === 'Pending');

  const isPublicScreen = currentScreen === 'home' || currentScreen === 'how_to_use';
  const isAuthScreen = currentScreen === 'login' || currentScreen === 'signup';
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="w-full top-0 sticky bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e6e8ea] z-40 shadow-xs">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 h-16 md:h-[72px] max-w-7xl mx-auto w-full">
        {/* Brand / Logo + 3-line Hamburger Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isPublicScreen && !isAuthScreen && (
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-xl text-[#191c1e] hover:bg-[#eceef0] active:scale-95 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#006a61] ${
                isSidebarOpen ? 'bg-[#86f2e4]/40 text-[#006f66]' : ''
              }`}
              title={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
            >
              <span className="material-symbols-outlined text-[26px]">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          )}

          <button
            onClick={() => setCurrentScreen(currentUser.role === 'admin' ? 'admin_dashboard' : 'home')}
            className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_with_heart
              </span>
            </div>
            <span className="font-bold text-lg sm:text-xl md:text-2xl text-[#000000] tracking-tight truncate">
              {t('appName')}
            </span>
          </button>
        </div>

        {/* Public Screen Actions */}
        {isPublicScreen && (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentScreen('how_to_use')}
              className={`hidden md:inline-flex px-4 py-2 font-semibold text-sm rounded-full transition-colors ${
                currentScreen === 'how_to_use'
                  ? 'bg-[#86f2e4] text-[#006f66]'
                  : 'text-[#45464d] hover:bg-[#eceef0]'
              }`}
            >
              {t('howToUse')}
            </button>
            <button
              onClick={() => setCurrentScreen('login')}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 border-2 border-[#000000] text-[#000000] font-bold text-xs sm:text-sm rounded-full hover:bg-[#eceef0] transition-colors"
            >
              {t('login')}
            </button>
            <button
              onClick={() => setCurrentScreen('signup')}
              className="inline-flex px-3.5 sm:px-6 py-2 sm:py-2.5 bg-[#006a61] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-[#005049] transition-all shadow-md active:scale-95"
            >
              {t('signUp')}
            </button>
          </div>
        )}

        {/* Auth Screen Actions */}
        {isAuthScreen && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('home')}
              className="text-xs sm:text-sm font-semibold text-[#006a61] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span className="hidden xs:inline">{t('backHome')}</span>
            </button>
          </div>
        )}

        {/* User / Admin App Bar Trailing Tools */}
        {!isPublicScreen && !isAuthScreen && (
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Quick Context Role Switcher */}
            <div className="hidden lg:flex items-center bg-[#eceef0] p-1 rounded-full border border-[#c6c6cd]">
              <button
                onClick={() => switchRole('user')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  !isAdmin
                    ? 'bg-[#006a61] text-white shadow-xs'
                    : 'text-[#45464d] hover:text-[#191c1e]'
                }`}
              >
                {t('userView')}
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  isAdmin
                    ? 'bg-[#006a61] text-white shadow-xs'
                    : 'text-[#45464d] hover:text-[#191c1e]'
                }`}
              >
                {t('adminPanel')}
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#45464d] hover:text-[#191c1e] hover:bg-[#eceef0] rounded-full transition-colors focus:ring-2 focus:ring-[#006a61]"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {pendingReports.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#c6c6cd] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
                    <h3 className="font-bold text-sm text-[#191c1e]">{t('safetyNotifications')}</h3>
                    <span className="text-xs bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full font-bold">
                      {pendingReports.length} {t('alerts')}
                    </span>
                  </div>
                  <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-[#ffdcc3]/40 border border-[#ffb77d] text-xs">
                      <p className="font-bold text-[#c76c00]">🚨 {t('high')} Alert</p>
                      <p className="text-[#45464d] mt-0.5">
                        New phishing campaign reported targeting local bank login links.
                      </p>
                    </div>
                    {pendingReports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-2.5 rounded-xl bg-[#f2f4f6] text-xs hover:bg-[#eceef0] cursor-pointer"
                        onClick={() => {
                          setShowNotifications(false);
                          setCurrentScreen(isAdmin ? 'admin_requests' : 'user_dashboard');
                        }}
                      >
                        <p className="font-semibold text-[#191c1e]">{rep.title}</p>
                        <p className="text-[#45464d] truncate">{rep.description}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      showToast('All notifications marked as read', 'info');
                    }}
                    className="w-full mt-2 py-2 text-center text-xs font-bold text-[#006a61] hover:underline"
                  >
                    {t('markAllRead')}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#eceef0] transition-colors"
                aria-label="Profile menu"
              >
                {isAdmin ? (
                  <div className="w-8 h-8 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs">
                    AD
                  </div>
                ) : currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#86f2e4]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center font-bold text-xs">
                    {currentUser.name
                      ? currentUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline font-semibold text-sm text-[#191c1e]">
                  {currentUser.name}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#76777d]">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#c6c6cd] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#eceef0]">
                    <p className="font-bold text-sm text-[#191c1e]">{currentUser.name}</p>
                    <p className="text-xs text-[#76777d] truncate">{currentUser.phone}</p>
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-[#86f2e4] text-[#006f66] font-bold">
                      {currentUser.role === 'admin' ? t('systemAdministrator') : currentUser.level}
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setCurrentScreen(isAdmin ? 'admin_settings' : 'privacy_settings');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#45464d] hover:bg-[#eceef0] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      <span>{t('settingsAndPrivacy')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        switchRole(isAdmin ? 'user' : 'admin');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#006a61] hover:bg-[#eceef0] flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">cached</span>
                      <span>{isAdmin ? t('switchToUser') : t('switchToAdmin')}</span>
                    </button>
                  </div>
                  <div className="border-t border-[#eceef0] pt-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setCurrentScreen('home');
                        showToast('Logged out securely.', 'info');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
