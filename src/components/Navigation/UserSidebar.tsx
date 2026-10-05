import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ScreenId } from '../../types';

export const UserSidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    logout,
    currentUser,
    isSidebarOpen,
    closeSidebar,
    switchRole,
  } = useApp();

  const { t } = useTranslation();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  const navItems: { id: ScreenId; labelKey: any; icon: string }[] = [
    { id: 'user_dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { id: 'personal_guide', labelKey: 'personalGuide', icon: 'forum' },
    { id: 'fraud_simulator', labelKey: 'fraudSimulator', icon: 'security' },
    { id: 'my_progress', labelKey: 'myProgress', icon: 'trending_up' },
    { id: 'report_scam', labelKey: 'reportScam', icon: 'report_problem' },
    { id: 'privacy_settings', labelKey: 'privacySettings', icon: 'lock' },
  ];

  const handleNavClick = (screenId: ScreenId) => {
    setCurrentScreen(screenId);
    closeSidebar();
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ease-out"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white flex flex-col shadow-2xl border-r border-[#eceef0] transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="User Navigation Menu"
        aria-hidden={!isSidebarOpen}
      >
        {/* Top Header & Close Button */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#eceef0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_with_heart
              </span>
            </div>
            <span className="font-bold text-lg text-[#191c1e] tracking-tight">
              {t('appName')}
            </span>
          </div>

          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-xl text-[#45464d] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006a61]"
            title="Close navigation"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* User Profile Header */}
        <div className="px-6 py-4 flex flex-col items-center text-center gap-2 border-b border-[#eceef0] bg-[#f7f9fb]/50">
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDESvHyclYBkxmy_-r63EYAYq6Gs1F9I8UeOAJicJj0D88Hz-9Am7fQBJaEJn0EpW9UIcQIjzbq-WXz7Y9f28AqZ0ui3Z2o3cQfOmhs1ZrQAnrZUl7NTPI_5cb8lULWFSPEwTWAetyWQavK_he3wHeo_N4EClFsoO2Y3ULz_ACsg_ZWrUKMpJcXh46l7lppr0ydottQWgvuRgq4BbJUZ_uF3v_Dp0gC5ZczY9XFLzNpEbJ56rphPomrAg"
              alt="User Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#86f2e4] shadow-xs"
            />
            <span className="absolute bottom-0 right-0.5 w-3 h-3 bg-[#006a61] border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-bold text-base text-[#191c1e] tracking-tight">{currentUser.name}</h2>
            <p className="text-xs text-[#76777d]">Digital Guardian</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-[#86f2e4]/40 text-[#006f66] font-semibold text-xs rounded-full">
              {currentUser.level || 'Level 2 Explorer'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 flex-1 px-4 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 text-left ${
                  isActive
                    ? 'bg-[#86f2e4] text-[#006f66] font-bold shadow-xs'
                    : 'text-[#45464d] hover:bg-[#eceef0] hover:text-[#191c1e]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#eceef0] space-y-1 mt-auto bg-[#fafafa]">
          <button
            onClick={() => {
              switchRole('admin');
              closeSidebar();
            }}
            className="flex items-center gap-3.5 px-4 py-2.5 w-full text-[#006a61] hover:bg-[#eceef0] rounded-xl transition-colors font-medium text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            <span>{t('switchToAdmin')}</span>
          </button>
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="flex items-center gap-3.5 px-4 py-2.5 w-full text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors font-medium text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
