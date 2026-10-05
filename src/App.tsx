import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAppBar } from './components/Navigation/TopAppBar';
import { UserSidebar } from './components/Navigation/UserSidebar';
import { AdminSidebar } from './components/Navigation/AdminSidebar';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { LanguageSelector } from './components/Common/LanguageSelector';
import { ToastContainer } from './components/Common/ToastContainer';
import { InteractiveLessonModal } from './components/Screens/InteractiveLessonModal';

// Screens
import { HomeScreen } from './components/Screens/HomeScreen';
import { HowToUseScreen } from './components/Screens/HowToUseScreen';
import { LoginScreen } from './components/Screens/LoginScreen';
import { SignUpScreen } from './components/Screens/SignUpScreen';
import { UserDashboard } from './components/Screens/UserDashboard';
import { PersonalGuideScreen } from './components/Screens/PersonalGuideScreen';
import { FraudSimulatorScreen } from './components/Screens/FraudSimulatorScreen';
import { MyProgressScreen } from './components/Screens/MyProgressScreen';
import { PrivacySettingsScreen } from './components/Screens/PrivacySettingsScreen';
import { ReportScamScreen } from './components/Screens/ReportScamScreen';
import { AdminDashboard } from './components/Screens/AdminDashboard';
import { AdminRequestCenter } from './components/Screens/AdminRequestCenter';
import { AdminUserManagement } from './components/Screens/AdminUserManagement';
import { AdminAnalytics } from './components/Screens/AdminAnalytics';
import { AdminSettings } from './components/Screens/AdminSettings';

const MainLayout: React.FC = () => {
  const { currentScreen, currentUser } = useApp();

  const isPublicScreen =
    currentScreen === 'home' ||
    currentScreen === 'how_to_use' ||
    currentScreen === 'login' ||
    currentScreen === 'signup';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'how_to_use':
        return <HowToUseScreen />;
      case 'login':
        return <LoginScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'user_dashboard':
        return <UserDashboard />;
      case 'personal_guide':
        return <PersonalGuideScreen />;
      case 'fraud_simulator':
        return <FraudSimulatorScreen />;
      case 'my_progress':
        return <MyProgressScreen />;
      case 'privacy_settings':
        return <PrivacySettingsScreen />;
      case 'report_scam':
        return <ReportScamScreen />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'admin_requests':
        return <AdminRequestCenter />;
      case 'admin_users':
        return <AdminUserManagement />;
      case 'admin_analytics':
        return <AdminAnalytics />;
      case 'admin_settings':
        return <AdminSettings />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans selection:bg-[#86f2e4] selection:text-[#006f66]">
      {/* Top Application Bar */}
      <TopAppBar />

      {/* Main Container Area */}
      <div className="flex-1 flex w-full">
        {/* Interactive Sidebar Drawer for User / Admin */}
        {!isPublicScreen && (currentUser.role === 'admin' ? <AdminSidebar /> : <UserSidebar />)}

        {/* Dynamic Screen Content */}
        <main
          className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${
            !isPublicScreen ? 'pb-24 md:pb-8' : ''
          }`}
        >
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation when logged in */}
      {!isPublicScreen && <MobileBottomNav />}

      {/* Floating Quick Language Switcher Widget (omnipresent access) */}
      <LanguageSelector variant="floating" />

      {/* Interactive Lesson Modal */}
      <InteractiveLessonModal />

      {/* Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
