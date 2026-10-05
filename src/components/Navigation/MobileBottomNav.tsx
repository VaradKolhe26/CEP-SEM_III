import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ScreenId } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, currentUser } = useApp();
  const { t } = useTranslation();

  const isPublic = currentScreen === 'home' || currentScreen === 'how_to_use' || currentScreen === 'login' || currentScreen === 'signup';
  if (isPublic) return null;

  const isAdmin = currentUser.role === 'admin';

  const userTabs: { id: ScreenId; labelKey: any; icon: string }[] = [
    { id: 'user_dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { id: 'fraud_simulator', labelKey: 'fraudSimulator', icon: 'security' },
    { id: 'personal_guide', labelKey: 'personalGuide', icon: 'forum' },
    { id: 'my_progress', labelKey: 'myProgress', icon: 'trending_up' },
    { id: 'report_scam', labelKey: 'reportScam', icon: 'report_problem' },
  ];

  const adminTabs: { id: ScreenId; labelKey: any; icon: string }[] = [
    { id: 'admin_dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { id: 'admin_requests', labelKey: 'requestCenter', icon: 'assignment_late' },
    { id: 'admin_users', labelKey: 'userManagement', icon: 'group' },
    { id: 'admin_analytics', labelKey: 'analytics', icon: 'bar_chart' },
    { id: 'admin_settings', labelKey: 'systemSettings', icon: 'settings' },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eceef0] px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentScreen(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              isActive ? 'text-[#006a61]' : 'text-[#76777d] hover:text-[#191c1e]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive ? 'scale-110 font-bold' : ''
              }`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {tab.icon}
            </span>
            <span className={`text-[10px] mt-0.5 truncate max-w-[65px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
