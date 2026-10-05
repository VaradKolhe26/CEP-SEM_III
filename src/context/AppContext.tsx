import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  LearningModule,
  ScamReport,
  SimulationScenario,
  AuthorizedDevice,
  SystemSettingsConfig,
  MentorChatMessage,
  ScreenId,
  Language,
} from '../types';
import {
  initialCurrentUser,
  initialAdminUser,
  initialUsersList,
  initialModules,
  initialScamReports,
  simulationScenarios,
  initialAuthorizedDevices,
  initialSystemSettings,
  initialMentorChatHistory,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserProfile;
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  usersList: UserProfile[];
  modules: LearningModule[];
  scamReports: ScamReport[];
  simulationScenarios: SimulationScenario[];
  authorizedDevices: AuthorizedDevice[];
  systemSettings: SystemSettingsConfig;
  mentorChatHistory: MentorChatMessage[];
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  // Auth
  login: (phone: string, pin: string, role: 'user' | 'admin') => boolean;
  signup: (name: string, phone: string, pin: string, role: 'user' | 'admin') => boolean;
  logout: () => void;
  switchRole: (role: 'user' | 'admin') => void;
  // Actions
  completeModuleLesson: (moduleId: string, stepIndex: number, quizScore?: number) => void;
  submitScamReport: (report: Omit<ScamReport, 'id' | 'reqId' | 'dateSubmitted' | 'status'>) => void;
  updateReportStatus: (reportId: string, status: 'Approved' | 'Rejected' | 'Resolved', notes?: string) => void;
  removeDevice: (deviceId: string) => void;
  signOutAllOtherDevices: () => void;
  updateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
  updateUserSecuritySettings: (settings: Partial<UserProfile>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  purgeLocalDefenseCache: () => void;
  exportUserDataArchive: () => void;
  toggleFraudLockdown: () => void;
  sendMentorMessage: (text: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'Active' | 'Suspended' | 'Pending Review') => void;
  // Active lesson in modal or view
  activeLessonModule: LearningModule | null;
  openLesson: (module: LearningModule) => void;
  closeLesson: () => void;
  // Sidebar State
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  // Badges
  earnedBadges: { id: string; name: string; icon: string; description: string; unlocked: boolean }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('safeguard_language');
      if (saved === 'en' || saved === 'hi' || saved === 'mr') {
        return saved;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('safeguard_language', newLang);
    } catch {}
    const langNames: Record<Language, string> = {
      en: 'Language switched to English',
      hi: 'भाषा बदलकर हिन्दी कर दी गई है',
      mr: 'भाषा बदलून मराठी करण्यात आली आहे',
    };
    showToast(langNames[newLang], 'info');
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>(initialCurrentUser);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [usersList, setUsersList] = useState<UserProfile[]>(initialUsersList);
  const [modules, setModules] = useState<LearningModule[]>(initialModules);
  const [scamReports, setScamReports] = useState<ScamReport[]>(initialScamReports);
  const [authorizedDevices, setAuthorizedDevices] = useState<AuthorizedDevice[]>(initialAuthorizedDevices);
  const [systemSettings, setSystemSettings] = useState<SystemSettingsConfig>(initialSystemSettings);
  const [mentorChatHistory, setMentorChatHistory] = useState<MentorChatMessage[]>(initialMentorChatHistory);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [activeLessonModule, setActiveLessonModule] = useState<LearningModule | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (phone: string, pin: string, role: 'user' | 'admin'): boolean => {
    if (role === 'admin') {
      setCurrentUser(initialAdminUser);
      setCurrentScreen('admin_dashboard');
      showToast('Welcome to SafeGuard Admin System!', 'success');
      return true;
    } else {
      const existing = usersList.find((u) => u.phone.includes(phone) || u.phone === phone);
      if (existing) {
        setCurrentUser(existing);
      } else {
        setCurrentUser({
          ...initialCurrentUser,
          phone,
          name: 'Rahul Sharma',
        });
      }
      setCurrentScreen('user_dashboard');
      showToast('Logged in safely. Welcome back!', 'success');
      return true;
    }
  };

  const signup = (name: string, phone: string, pin: string, role: 'user' | 'admin'): boolean => {
    const newUser: UserProfile = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      name: name.trim() || 'New User',
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role,
      level: role === 'admin' ? 'System Administrator' : 'Level 1 Beginner',
      securityScore: 60,
      status: 'Active',
      lastLogin: 'Just now',
      completedModules: 0,
      totalModules: 5,
      mfaEnabled: false,
      dataSharing: true,
      loginAlerts: true,
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
      showToast('Admin Account created successfully!', 'success');
    } else {
      setCurrentScreen('user_dashboard');
      showToast('Welcome to SafeGuard Digital! Your account is ready.', 'success');
    }
    return true;
  };

  const logout = () => {
    setCurrentScreen('home');
    showToast('Logged out securely.', 'info');
  };

  const switchRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(initialAdminUser);
      setCurrentScreen('admin_dashboard');
      showToast('Switched to Admin context.', 'info');
    } else {
      setCurrentUser(initialCurrentUser);
      setCurrentScreen('user_dashboard');
      showToast('Switched to User context.', 'info');
    }
  };

  const completeModuleLesson = (moduleId: string, stepIndex: number, quizScore?: number) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          const newProgress = Math.min(100, Math.round(((stepIndex + 1) / mod.steps.length) * 100));
          const completed = newProgress === 100;
          return {
            ...mod,
            progressPercent: newProgress,
            isCompleted: completed,
            quizScore: quizScore !== undefined ? quizScore : mod.quizScore || 90,
          };
        }
        return mod;
      })
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#006a61', '#86f2e4', '#c76c00', '#ffdcc3'],
      });
    } catch {
      // ignore
    }

    // Recalculate user score
    setCurrentUser((prev) => {
      const completedCount = modules.filter((m) => m.id === moduleId || m.isCompleted).length;
      const newScore = Math.min(100, 60 + completedCount * 8 + (prev.mfaEnabled ? 15 : 0));
      return {
        ...prev,
        completedModules: completedCount,
        securityScore: newScore,
      };
    });

    showToast('Module progress updated! Great job learning.', 'success');
  };

  const submitScamReport = (report: Omit<ScamReport, 'id' | 'reqId' | 'dateSubmitted' | 'status'>) => {
    const newReport: ScamReport = {
      ...report,
      id: `rep-${Date.now()}`,
      reqId: `#REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      dateSubmitted: 'Just now',
      status: 'Pending',
    };
    setScamReports((prev) => [newReport, ...prev]);
    showToast('Report submitted! Thank you for protecting the community.', 'success');
    setCurrentScreen('user_dashboard');
  };

  const updateReportStatus = (reportId: string, status: 'Approved' | 'Rejected' | 'Resolved', notes?: string) => {
    setScamReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              status,
              adminNotes: notes || rep.adminNotes,
              autoBlockApplied: status === 'Approved',
            }
          : rep
      )
    );
    showToast(`Report ${status.toLowerCase()} successfully.`, 'info');
  };

  const removeDevice = (deviceId: string) => {
    setAuthorizedDevices((prev) => prev.filter((d) => d.id !== deviceId));
    showToast('Device removed from authorized sessions.', 'info');
  };

  const signOutAllOtherDevices = () => {
    setAuthorizedDevices((prev) => prev.filter((d) => d.isCurrent));
    showToast('Signed out of all other devices successfully.', 'success');
  };

  const updateSettings = (newSettings: Partial<SystemSettingsConfig>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('System settings saved.', 'success');
  };

  const updateUserSecuritySettings = (settings: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...settings };
      // Base score is derived from completed education modules + active defense shields
      let newScore = 40 + (updated.completedModules || 0) * 8;
      if (updated.mfaEnabled) newScore += 12;
      if (updated.loginAlerts) newScore += 5;
      if (updated.biometricLock) newScore += 10;
      if (updated.upiSafetyShield) newScore += 10;
      if (updated.simSwapAlerts) newScore += 8;
      if (updated.phishingLinkQuarantine) newScore += 8;
      if (updated.unknownDeviceLockdown) newScore += 7;
      return {
        ...updated,
        securityScore: Math.min(100, Math.max(25, newScore)),
      };
    });
    showToast('Security settings updated successfully.', 'success');
  };

  const purgeLocalDefenseCache = () => {
    try {
      localStorage.removeItem('safeguard_mentor_history');
      localStorage.removeItem('safeguard_sim_history');
    } catch {}
    showToast('Local defense cache and temporary activity purged.', 'success');
  };

  const exportUserDataArchive = () => {
    try {
      const exportData = {
        app: 'SafeGuard Cyber Fraud Defense',
        version: '2.4.0',
        exportedAt: new Date().toISOString(),
        userProfile: {
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone,
          email: currentUser.email,
          role: currentUser.role,
          securityScore: currentUser.securityScore,
          mfaEnabled: currentUser.mfaEnabled,
          biometricLock: currentUser.biometricLock,
          autoLockMinutes: currentUser.autoLockMinutes,
          upiSafetyShield: currentUser.upiSafetyShield,
          simSwapAlerts: currentUser.simSwapAlerts,
          phishingLinkQuarantine: currentUser.phishingLinkQuarantine,
          maskPersonalDataInReports: currentUser.maskPersonalDataInReports,
          unknownDeviceLockdown: currentUser.unknownDeviceLockdown,
          emergencyContactPhone: currentUser.emergencyContactPhone,
          completedModulesCount: currentUser.completedModules,
        },
        authorizedSessionsCount: authorizedDevices.length,
        submittedReportsCount: scamReports.filter(
          (r) => r.reportedBy === currentUser.name || r.userPhone === currentUser.phone
        ).length,
        dpdpComplianceStatus: 'Consent Recorded & Data Portability Verified (DPDP Act 2023)',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `safeguard-defense-archive-${currentUser.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Security archive exported successfully!', 'success');
    } catch {
      showToast('Could not export security data.', 'error');
    }
  };

  const toggleFraudLockdown = () => {
    setCurrentUser((prev) => {
      const nextState = !prev.fraudLockdownMode;
      if (nextState) {
        showToast('🚨 CRISIS LOCKDOWN ACTIVATED: Sensitive transactions restricted.', 'error');
      } else {
        showToast('Crisis lockdown deactivated. Normal security restored.', 'info');
      }
      return { ...prev, fraudLockdownMode: nextState };
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...profile }));
    setUsersList((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...profile } : u))
    );
    showToast('Profile updated successfully!', 'success');
  };

  const updateUserStatus = (userId: string, status: 'Active' | 'Suspended' | 'Pending Review') => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    showToast(`User status updated to ${status}.`, 'info');
  };

  const sendMentorMessage = async (text: string) => {
    const userMsg: MentorChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMentorChatHistory((prev) => [...prev, userMsg]);

    // Generate intelligent reassuring mentor response
    setTimeout(() => {
      let replyText = '';
      const lower = text.toLowerCase();

      if (language === 'hi') {
        if (lower.includes('password') || lower.includes('पासवर्ड')) {
          replyText =
            '🔐 मजबूत पासवर्ड का नियम: 3 याद रहने वाले शब्दों का एक संयोजन बनाएं और बीच में चिह्न लगाएं (जैसे "आम!नदी$साइकिल8")। कभी भी अपना जन्मदिन, मोबाइल नंबर या पालतू जानवर का नाम न रखें।';
        } else if (lower.includes('arrest') || lower.includes('police') || lower.includes('cbi') || lower.includes('कस्टम') || lower.includes('डिजिटल अरेस्ट')) {
          replyText =
            '🚨 सावधान: भारत में "डिजिटल अरेस्ट" जैसा कोई कानूनी प्रावधान नहीं है! पुलिस, सीबीआई, या कस्टम कभी भी व्हाट्सएप या स्काइप वीडियो कॉल पर पूछताछ या गिरफ्तारी नहीं करते। तुरंत कॉल काटें और 1930 पर रिपोर्ट करें।';
        } else if (lower.includes('job') || lower.includes('telegram') || lower.includes('नौकरी') || lower.includes('पार्ट टाइम')) {
          replyText =
            '💼 पार्ट-टाइम जॉब फ्रॉड: "यूट्यूब वीडियो लाइक करके रोज ₹2000 कमाएं" जैसे मैसेज पूरी तरह फर्जी हैं। शुरुआत में वे ₹200 देकर भरोसा जीतते हैं, फिर बड़ा पैसा जमा करवाते हैं। कोई भी असली कंपनी नौकरी देने के लिए पैसे नहीं मांगती!';
        } else if (lower.includes('link') || lower.includes('clicked') || lower.includes('लिंक') || lower.includes('क्लिक')) {
          replyText =
            '⚠️ यदि आपने किसी अनजान लिंक पर क्लिक कर दिया है: 1. तुरंत कोई भी पासवर्ड या ओटीपी दर्ज न करें। 2. ब्राउज़र टैब तुरंत बंद करें। 3. यदि बैंक विवरण भर दिया है, तो तुरंत अपने बैंक ऐप से कार्ड ब्लॉक करें और 1930 पर कॉल करें।';
        } else if (lower.includes('email') || lower.includes('phishing') || lower.includes('ईमेल') || lower.includes('फ़िशिंग')) {
          replyText =
            '📧 नियम #1 याद रखें: हमेशा प्रेषक का वास्तविक ईमेल पता जांचें, केवल उनका नाम नहीं! यदि कोई बैंक ईमेल मुफ़्त जीमेल या अजीब डोमेन (.xyz, .cc) से आता है, तो वह 100% धोखाधड़ी है।';
        } else if (lower.includes('upi') || lower.includes('qr') || lower.includes('pay') || lower.includes('pin') || lower.includes('पिन') || lower.includes('यूपीआई')) {
          replyText =
            '📱 यूपीआई का अखंड नियम: आप अपना 4 या 6 अंकों का पिन केवल पैसे भेजते समय ही दर्ज करते हैं। पैसे प्राप्त (Receive) करने के लिए कभी भी पिन की आवश्यकता नहीं होती!';
        } else if (lower.includes('1930') || lower.includes('helpline') || lower.includes('पैसे कट') || lower.includes('हेल्पलाइन')) {
          replyText =
            '⏱️ गोल्डन ऑवर: यदि आपके खाते से धोखाधड़ी से पैसे कट गए हैं, तो तुरंत 1930 पर कॉल करें! 2 घंटे के भीतर शिकायत दर्ज कराने से पुलिस धोखेबाज के बैंक खाते को तुरंत फ्रीज कर सकती है।';
        } else if (lower.includes('otp') || lower.includes('ओटीपी')) {
          replyText =
            '🛑 कभी भी अपना वन टाइम पासवर्ड (OTP) किसी को न दें! चाहे वह बैंक मैनेजर, कूरियर बॉय या बिजली विभाग का कर्मचारी बनकर कॉल करे। असली बैंक कभी ओटीपी नहीं मांगते।';
        } else {
          replyText =
            '🛡️ मैं हर कदम पर आपके साथ हूँ! डिजिटल सुरक्षा में हमेशा 3 बातें याद रखें: 1. घबराहट या जल्दबाजी में निर्णय न लें। 2. ओटीपी/पिन कभी साझा न करें। 3. लिंक पर क्लिक करने से पहले डोमेन जांचें। मैं आपकी और क्या मदद करूँ?';
        }
      } else if (language === 'mr') {
        if (lower.includes('password') || lower.includes('पासवर्ड')) {
          replyText =
            '🔐 मजबूत पासवर्ड नियम: ३ सोपे शब्द आणि चिन्हांचा वापर करा (उदा. "आंबा!नदी$सायकल८"). कधीही जन्मदिनांक किंवा मोबाईल नंबर पासवर्ड ठेवू नका.';
        } else if (lower.includes('arrest') || lower.includes('police') || lower.includes('cbi') || lower.includes('डिजिटल अरेस्ट')) {
          replyText =
            '🚨 सावधान: भारतात "डिजिटल अरेस्ट" असा कोणताही कायदेशीर प्रकार नाही! पोलिस किंवा सीबीआय कधीही व्हॉट्सॲप किंवा स्काईप व्हिडिओ कॉलवर अटक करत नाहीत. असा कॉल आल्यास त्वरित कट करा आणि १९३० वर तक्रार नोंदवा.';
        } else if (lower.includes('job') || lower.includes('telegram') || lower.includes('नोकरी') || lower.includes('पार्ट टाइम')) {
          replyText =
            '💼 पार्ट-टाइम जॉब घोटाळा: "व्हिडिओ लाईक करा आणि रोज पैसे मिळवा" अशा ऑफर्सपासून सावध राहा. खरी कंपनी कामासाठी कधीही आधी पैसे मागत नाही!';
        } else if (lower.includes('link') || lower.includes('clicked') || lower.includes('लिंक') || lower.includes('क्लिक')) {
          replyText =
            '⚠️ जर तुम्ही संशयास्पद लिंकवर क्लिक केले असेल: १. कोणताही पासवर्ड किंवा ओटीपी टाकू नका. २. ताबडतोब टॅब बंद करा. ३. जर बँक तपशील दिले असतील तर तात्काळ कार्ड ब्लॉक करा आणि १९३० वर कॉल करा.';
        } else if (lower.includes('email') || lower.includes('phishing') || lower.includes('ईमेल') || lower.includes('फिशिंग')) {
          replyText =
            '📧 नेहमी प्रेषकाचा खरा ईमेल पत्ता तपासा, केवळ नाव नाही! जर अधिकृत बँकेचा ईमेल मोफत Gmail किंवा विचित्र डोमेन (.xyz, .cc) वरून आला असेल, तर ती फसवणूक आहे.';
        } else if (lower.includes('upi') || lower.includes('qr') || lower.includes('pay') || lower.includes('pin') || lower.includes('पिन') || lower.includes('यूपीआई')) {
          replyText =
            '📱 UPI चा सुवर्ण नियम: आपण आपला ४ किंवा ६ अंकी पिन फक्त पैसे पाठवतानाच टाकतो. पैसे मिळवण्यासाठी (Receive) कधीही पिन लागत नाही!';
        } else if (lower.includes('1930') || lower.includes('helpline') || lower.includes('पैसे गेले') || lower.includes('हेल्पलाइन')) {
          replyText =
            '⏱️ गोल्डन अवर: फसवणुकीने पैसे कापले गेल्यास त्वरित १९३० क्रमांकावर कॉल करा! पहिल्या २ तासांत तक्रार केल्यास फसवणूक झालेल्या रकमेचे हस्तांतरण रोखता येते.';
        } else if (lower.includes('otp') || lower.includes('ओटीपी')) {
          replyText =
            '🛑 कोणालाही आपला ओटीपी (OTP) सांगू नका! बँक अधिकारी किंवा कस्टमर केअर कधीही ओटीपी मागत नाहीत.';
        } else {
          replyText =
            '🛡️ मी आपल्या सुरक्षिततेसाठी सदैव उपलब्ध आहे! डिजिटल जगात घाई न करणे हाच सर्वात मोठा बचाव आहे. आपल्याला आणखी कोणती मदत हवी आहे?';
        }
      } else {
        if (lower.includes('password') || lower.includes('passwords')) {
          replyText =
            '🔐 Passphrase Rule: Create memorable passwords by chaining 3 random words with symbols (e.g. "Mango!River$Bicycle8"). Never use birthdays, phone numbers, or pet names.';
        } else if (lower.includes('arrest') || lower.includes('police') || lower.includes('cbi') || lower.includes('customs') || lower.includes('digital arrest')) {
          replyText =
            '🚨 URGENT WARNING: There is NO legal procedure called "Digital Arrest" in India! Genuine Police, CBI, ED, and Customs NEVER conduct interrogations or demand money over WhatsApp/Skype video calls. Disconnect immediately and report to 1930.';
        } else if (lower.includes('job') || lower.includes('telegram') || lower.includes('task') || lower.includes('part time') || lower.includes('work from home')) {
          replyText =
            '💼 Part-Time Job / Task Scam Alert: Scammers send messages claiming you can earn ₹2,000/day by liking YouTube videos or rating hotels. They pay ₹200 initially to build trust, then lock your money in fake crypto/VIP schemes. Legitimate jobs NEVER require upfront payments!';
        } else if (lower.includes('link') || lower.includes('clicked') || lower.includes('url')) {
          replyText =
            '⚠️ Action Plan if you clicked a suspicious link: 1. Do NOT type any PIN, password, or OTP. 2. Close the browser tab immediately. 3. If you submitted banking credentials, immediately freeze your debit card in your banking app and dial 1930.';
        } else if (lower.includes('sms') || lower.includes('bank sms') || lower.includes('electricity') || lower.includes('bill') || lower.includes('kyc')) {
          replyText =
            '📱 SMS Verification Rule: Real Indian banks and utility boards send SMS with official 6-character sender headers (e.g. "HDFCBK", "SBINB", "MSEBDC") - NEVER from normal 10-digit mobile numbers (+91-98...). Any SMS saying "Electricity will be disconnected tonight" with a personal mobile number is 100% FRAUD.';
        } else if (lower.includes('email') || lower.includes('phishing')) {
          replyText =
            '📧 Sender Domain Inspection: Always look past the display name (e.g. "Netflix Official") and check the actual email domain after "@". If it says "@netflx-account-renew.com" or "@gmail.com", it is a malicious spoof!';
        } else if (lower.includes('upi') || lower.includes('qr') || lower.includes('pay') || lower.includes('pin')) {
          replyText =
            '📱 Golden Rule of UPI: You ONLY enter your 4 or 6-digit UPI PIN to SEND money, never to receive money or cashback. If an OLX buyer or QR code asks for your PIN to "credit" your account, it is an unauthorized debit trap!';
        } else if (lower.includes('1930') || lower.includes('helpline') || lower.includes('lost money') || lower.includes('freeze') || lower.includes('golden hour')) {
          replyText =
            '⏱️ The Golden Hour Protocol: If money was unauthorizedly debited, dial 1930 immediately! The Indian Cybercrime Coordination Centre (I4C) can freeze the recipient bank account before the scammer withdraws cash at an ATM. Also lodge a report at cybercrime.gov.in.';
        } else if (lower.includes('otp')) {
          replyText =
            '🛑 OTP Golden Rule: Never share your OTP with anyone over a call, text, or WhatsApp. Real bank personnel, courier delivery agents, and police officers will NEVER ask for your OTP.';
        } else {
          replyText =
            '🛡️ I am right here with you! Digital safety is about staying calm and checking the facts: 1. Never act on sudden urgency. 2. Keep PINs and OTPs completely private. 3. Verify sender identities. How else can I assist your defense today?';
        }
      }

      const options =
        language === 'hi'
          ? ['डिजिटल अरेस्ट स्कैम क्या है?', 'फर्जी बैंक एसएमएस पहचानें', 'टेलीग्राम जॉब फ्रॉड', 'गोल्डन ऑवर 1930 हेल्पलाइन']
          : language === 'mr'
          ? ['डिजिटल अरेस्ट म्हणजे काय?', 'बँकेचा बनावट मेसेज कसा ओळखावा?', 'पार्ट टाइम जॉब घोटाळा', '१९३० हेल्पलाइन नियम']
          : ['What is "Digital Arrest"?', 'Detect Fake Bank SMS', 'Telegram Part-Time Job Scam', 'Golden Hour: 1930 Protocol'];

      const mentorMsg: MentorChatMessage = {
        id: `men-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options,
      };

      setMentorChatHistory((prev) => [...prev, mentorMsg]);
    }, 600);
  };

  const openLesson = (module: LearningModule) => {
    setActiveLessonModule(module);
  };

  const closeLesson = () => {
    setActiveLessonModule(null);
  };

  const earnedBadges = [
    {
      id: 'b-1',
      name: language === 'hi' ? 'पासवर्ड प्रो' : language === 'mr' ? 'पासवर्ड प्रो' : 'Password Pro',
      icon: 'vpn_key',
      description:
        language === 'hi'
          ? '90%+ स्कोर के साथ पासवर्ड सुरक्षा बुनियादी बातें पूरी कीं।'
          : language === 'mr'
          ? '९०%+ गुणांसह पासवर्ड सुरक्षा मूलभूत गोष्टी पूर्ण केल्या.'
          : 'Completed password security basics with 90%+ score.',
      unlocked: true,
    },
    {
      id: 'b-2',
      name: language === 'hi' ? 'स्कैम स्पॉटर' : language === 'mr' ? 'स्कॅम स्पॉटर' : 'Scam Spotter',
      icon: 'visibility',
      description:
        language === 'hi'
          ? 'सिम्युलेटर में 3 फ़िशिंग प्रयासों को सफलतापूर्वक पकड़ा।'
          : language === 'mr'
          ? 'सिम्युलेटरमध्ये ३ फिशिंग प्रयत्न यशस्वीपणे ओळखले.'
          : 'Identified 3 phishing attempts in the simulator.',
      unlocked: true,
    },
    {
      id: 'b-3',
      name: language === 'hi' ? 'पेमेंट शील्ड' : language === 'mr' ? 'पेमेंट शील्ड' : 'Payment Shield',
      icon: 'verified_user',
      description:
        language === 'hi'
          ? 'UPI और बैंकिंग सुरक्षा प्रोटोकॉल में महारत हासिल की।'
          : language === 'mr'
          ? 'UPI आणि बँकिंग सुरक्षा प्रोटोकॉलमध्ये प्रावीण्य मिळवले.'
          : 'Mastered UPI & Banking security protocols.',
      unlocked: currentUser.completedModules >= 2,
    },
    {
      id: 'b-4',
      name: language === 'hi' ? 'साइबर गार्जियन' : language === 'mr' ? 'सायबर गार्डियन' : 'Cyber Guardian',
      icon: 'shield_with_heart',
      description:
        language === 'hi'
          ? '90+ समग्र सुरक्षा स्कोर प्राप्त किया।'
          : language === 'mr'
          ? '९०+ एकूण सुरक्षा स्कोअर गाठला.'
          : 'Reached 90+ overall security score.',
      unlocked: currentUser.securityScore >= 90,
    },
  ];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        currentScreen,
        setCurrentScreen,
        usersList,
        modules,
        scamReports,
        simulationScenarios,
        authorizedDevices,
        systemSettings,
        mentorChatHistory,
        toasts,
        showToast,
        dismissToast,
        login,
        signup,
        logout,
        switchRole,
        completeModuleLesson,
        submitScamReport,
        updateReportStatus,
        removeDevice,
        signOutAllOtherDevices,
        updateSettings,
        updateUserSecuritySettings,
        updateUserProfile,
        purgeLocalDefenseCache,
        exportUserDataArchive,
        toggleFraudLockdown,
        sendMentorMessage,
        updateUserStatus,
        activeLessonModule,
        openLesson,
        closeLesson,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        earnedBadges,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
