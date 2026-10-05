import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ScreenId } from '../../types';

export const AdminSidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    logout,
    scamReports,
    showToast,
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

  const pendingReportsCount = scamReports.filter((r) => r.status === 'Pending').length;

  const adminNavItems: { id: ScreenId; labelKey: any; icon: string; badge?: number }[] = [
    { id: 'admin_dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { id: 'admin_users', labelKey: 'userManagement', icon: 'group' },
    { id: 'admin_requests', labelKey: 'requestCenter', icon: 'assignment_late', badge: pendingReportsCount },
    { id: 'admin_analytics', labelKey: 'analytics', icon: 'bar_chart' },
    { id: 'admin_settings', labelKey: 'systemSettings', icon: 'settings' },
  ];

  const handleNavClick = (screen: ScreenId) => {
    setCurrentScreen(screen);
    closeSidebar();
  };

  return (
    <>
      {/* Mobile / Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ease-out"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Admin Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white flex flex-col shadow-2xl border-r border-[#eceef0] transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin Navigation Menu"
        aria-hidden={!isSidebarOpen}
      >
        {/* Admin Header & Close Button */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#eceef0]">
          <div
            onClick={() => handleNavClick('admin_dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs tracking-wider transition-transform group-hover:scale-105">
              SG
            </div>
            <div>
              <h1 className="font-bold text-base text-[#191c1e] tracking-tight">{t('appName')} Admin</h1>
              <p className="text-xs text-[#76777d]">System Control Center</p>
            </div>
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

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#86f2e4] text-[#006f66] font-bold shadow-xs'
                    : 'text-[#45464d] hover:bg-[#eceef0] hover:text-[#191c1e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{t(item.labelKey)}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#eceef0] space-y-1 mt-auto bg-[#fafafa]">
          <button
            onClick={() => {
              switchRole('user');
              closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#006a61] hover:bg-[#eceef0] rounded-xl text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span>{t('switchToUser')}</span>
          </button>
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
