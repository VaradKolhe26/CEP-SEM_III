export type UserRole = 'user' | 'admin';
export type Language = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
  level: string;
  securityScore: number;
  status: 'Active' | 'Suspended' | 'Pending Review';
  lastLogin: string;
  completedModules: number;
  totalModules: number;
  mfaEnabled: boolean;
  dataSharing: boolean;
  loginAlerts: boolean;
  biometricLock?: boolean;
  autoLockMinutes?: number;
  upiSafetyShield?: boolean;
  simSwapAlerts?: boolean;
  maskPersonalDataInReports?: boolean;
  phishingLinkQuarantine?: boolean;
  unknownDeviceLockdown?: boolean;
  emergencyContactPhone?: string;
  fraudLockdownMode?: boolean;
  city?: string;
  state?: string;
  occupation?: string;
  bio?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  tip?: string;
  warning?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  description: string;
  lessonsCount: number;
  estimatedMinutes: number;
  progressPercent: number;
  isCompleted: boolean;
  quizScore?: number;
  category: string;
  steps: LessonStep[];
}

export interface ScamReport {
  id: string;
  reqId: string;
  dateSubmitted: string;
  reportedBy: string;
  userPhone?: string;
  userEmail?: string;
  category: 'Security' | 'Account' | 'SMS' | 'Call' | 'Website' | 'Email';
  scamType: 'email' | 'text' | 'call' | 'website';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Resolved';
  screenshotUrl?: string;
  adminNotes?: string;
  autoBlockApplied?: boolean;
}

export interface SimulationScenario {
  id: string;
  type: 'sms' | 'email' | 'popup' | 'upi';
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenarioDescription: string;
  mockSender: string;
  mockContent: string;
  fakeLinkOrTarget?: string;
  redFlags: string[];
  explanation: string;
  correctAction: 'report' | 'delete' | 'block' | 'safe';
}

export interface AuthorizedDevice {
  id: string;
  deviceName: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
  browser: string;
}

export interface SystemSettingsConfig {
  platformName: string;
  adminEmail: string;
  timezone: string;
  dailySummaryEmails: boolean;
  criticalSecurityAlerts: boolean;
  minPasswordLength: number;
  authRequirement: 'mfa' | 'password_only';
  sessionTimeoutMinutes: number;
}

export interface MentorChatMessage {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
  options?: string[];
}

export type ScreenId =
  | 'home'
  | 'how_to_use'
  | 'login'
  | 'signup'
  | 'user_dashboard'
  | 'personal_guide'
  | 'my_progress'
  | 'privacy_settings'
  | 'report_scam'
  | 'fraud_simulator'
  | 'admin_dashboard'
  | 'admin_requests'
  | 'admin_users'
  | 'admin_analytics'
  | 'admin_settings';
