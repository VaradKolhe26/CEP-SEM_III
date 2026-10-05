import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisResult {
  riskScore: number;
  riskLevel: 'safe' | 'medium' | 'critical';
  headline: string;
  detectedFlags: string[];
  safeAction: string;
  category: string;
}

const PRESET_SCAM_SAMPLES = [
  {
    label: '🔴 Fake SBI APK SMS',
    text: 'Dear Customer, your SBI YONO account has been suspended due to pending KYC. Download & update YONO app immediately from http://sbi-kyc-yono.top/update.apk to avoid permanent freeze.',
  },
  {
    label: '🔴 Electricity Disconnection Alert',
    text: 'Urgent: Electricity power will be disconnected tonight at 9:30 PM from the power station because your previous month bill was not updated. Please immediately contact our power officer at +91-9876543210.',
  },
  {
    label: '🟡 Telegram Part-Time Job Offer',
    text: 'Congratulations! You are selected for flexible Work From Home job. Just like 3 YouTube videos and get ₹500 instantly in your bank account. Daily income ₹2,000-₹5,000. Join our Telegram channel now: t.me/vip_task_rewards',
  },
  {
    label: '🟢 Genuine Bank Balance SMS',
    text: 'Dear Customer, INR 3,450.00 credited to your A/C XX4129 on 04-Oct-26 by UPI/Ref 4291849102. Available Balance: INR 48,210.50. - State Bank of India',
  },
];

const GOLDEN_RULES = [
  {
    icon: '🛑',
    title: '1. Stop & Breathe',
    desc: 'Scammers invent artificial urgency ("Act in 10 minutes or lose money"). Take 5 minutes to verify before clicking or replying.',
    badge: 'Urgency Trap Defense',
  },
  {
    icon: '📱',
    title: '2. PIN is for Sending',
    desc: 'You NEVER type your 4 or 6-digit UPI PIN to receive money, cashback, or rewards. Entering PIN only authorizes money leaving your account.',
    badge: 'UPI Golden Rule',
  },
  {
    icon: '🔑',
    title: '3. Keep OTP 100% Secret',
    desc: 'No genuine bank manager, electricity officer, or police will ever ask for your OTP. Never share it over calls, text, or WhatsApp.',
    badge: 'Zero Trust Protocol',
  },
  {
    icon: '🔍',
    title: '4. Check the Actual Domain',
    desc: 'Display names like "Netflix Support" or "HDFC Alert" can be faked. Always check the actual domain after @ (e.g. netflx.cc is fake).',
    badge: 'Phishing Detection',
  },
];

const AUDIT_CHECKLIST_ITEMS = [
  {
    id: 'mfa',
    title: 'Two-Factor Authentication (2FA) Active',
    desc: 'Enabled on Google, WhatsApp, Netbanking, and primary email accounts.',
  },
  {
    id: 'intl-card',
    title: 'International Online Card Usage Turned OFF',
    desc: 'Disabled in your mobile banking card controls when not traveling abroad.',
  },
  {
    id: 'upi-limit',
    title: 'Daily UPI Transaction Limit Configured',
    desc: 'Capped at reasonable daily limit (e.g. ₹5,000–₹10,000) rather than default ₹1,00,000.',
  },
  {
    id: 'passphrase',
    title: 'Unique 3-Word Passphrase for Banking',
    desc: 'Using chained words with symbols (e.g. "Mango!River$Bicycle8") without reusing passwords.',
  },
  {
    id: 'app-store',
    title: 'Unknown App / APK Installation Disabled',
    desc: 'Phone restricted strictly to official Google Play Store or Apple App Store downloads.',
  },
  {
    id: 'sim-pin',
    title: 'SIM Card PIN Lock Configured',
    desc: 'Prevents unauthorized SIM swap takeover if physical device is misplaced.',
  },
];

const QUICK_PROMPTS = [
  { label: '🚨 Digital Arrest Scam', query: 'What is digital arrest scam and can police arrest on video call?' },
  { label: '🏦 Scanning QR to Receive Money', query: 'Can someone debit money from my account if I scan a QR code to receive payment?' },
  { label: '📱 Electricity Bill Cut SMS', query: 'I got an SMS saying my electricity power will be cut tonight at 9:30 PM. Is this real?' },
  { label: '⏱️ Transferred Money (1930)', query: 'I transferred money to a scammer recently. What should I do right now?' },
  { label: '💼 Telegram YouTube Job', query: 'Someone offered me ₹500 for liking YouTube videos on Telegram. Is this legitimate?' },
  { label: '🔐 Unbreakable Password', query: 'How do I create a strong memorable password that cannot be hacked?' },
];

export const PersonalGuideScreen: React.FC = () => {
  const { currentUser, mentorChatHistory, sendMentorMessage, showToast } = useApp();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'chat' | 'analyzer' | 'emergency' | 'audit'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeRuleIndex, setActiveRuleIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Scanner state
  const [scannerInput, setScannerInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Audit state
  const [checkedAuditIds, setCheckedAuditIds] = useState<string[]>(['mfa', 'app-store']);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mentorChatHistory, isTyping, activeTab]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || isTyping) return;

    setChatInput('');
    setIsTyping(true);

    try {
      await sendMentorMessage(textToSend);
    } catch {
      showToast('Could not send message. Please try again.', 'error');
    } finally {
      setTimeout(() => {
        setIsTyping(false);
      }, 700);
    }
  };

  const handleCopy = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied to clipboard!', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Voice read-aloud is not supported on this browser.', 'info');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const runAnalysis = (contentToAnalyze?: string) => {
    const text = contentToAnalyze || scannerInput;
    if (!text.trim()) {
      showToast('Please paste a message or URL to analyze.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let riskScore = 10;
      const flags: string[] = [];
      let category = 'Unknown Message';
      let safeAction = 'This message appears routine, but always verify sender identity before sharing details.';

      const hasApk = lower.includes('.apk') || lower.includes('download') || lower.includes('install');
      const hasSuspiciousDomain =
        lower.includes('.top') ||
        lower.includes('.cc') ||
        lower.includes('.xyz') ||
        lower.includes('bit.ly') ||
        lower.includes('tinyurl') ||
        lower.includes('http://');
      const hasUrgency =
        lower.includes('immediately') ||
        lower.includes('tonight') ||
        lower.includes('within 2 hours') ||
        lower.includes('suspended') ||
        lower.includes('disconnected') ||
        lower.includes('urgent') ||
        lower.includes('blocked');
      const hasFinancialTrap =
        lower.includes('kyc') ||
        lower.includes('yono') ||
        lower.includes('bill') ||
        lower.includes('electricity') ||
        lower.includes('upi pin') ||
        lower.includes('qr code') ||
        lower.includes('lottery') ||
        lower.includes('reward') ||
        lower.includes('like youtube') ||
        lower.includes('telegram');
      const hasPersonalPhone = /\+?91[-\s]?[6-9]\d{9}/.test(text) || /\b[6-9]\d{9}\b/.test(text);

      if (hasApk) {
        riskScore += 45;
        flags.push('Direct APK File Download: Real banks only distribute apps via Google Play Store / Apple App Store.');
        category = 'Malicious Android Trojan / APK Trap';
      }

      if (hasSuspiciousDomain) {
        riskScore += 30;
        flags.push('Unverified / Lookalike Domain: Uses non-official extensions (.top, .xyz, unencrypted HTTP).');
        category = 'Phishing Link Trap';
      }

      if (hasUrgency) {
        riskScore += 25;
        flags.push('Psychological Panic Hook: Imposes aggressive deadline ("tonight", "suspended") to prevent logical thinking.');
      }

      if (hasFinancialTrap) {
        riskScore += 25;
        flags.push('High-Risk Financial Pretext: Impersonates KYC, electricity billing, or easy task rewards.');
      }

      if (hasPersonalPhone && (lower.includes('electricity') || lower.includes('bank') || lower.includes('power'))) {
        riskScore += 30;
        flags.push('Personal 10-Digit Mobile Sender: Official utilities never provide personal mobile numbers for bill clearance.');
      }

      const isLegitBankPattern =
        (lower.includes('credited') || lower.includes('debited')) &&
        lower.includes('available balance') &&
        !lower.includes('http') &&
        !lower.includes('call +91');

      if (isLegitBankPattern && flags.length === 0) {
        riskScore = 5;
        category = 'Standard Banking Transaction Notification';
        safeAction = 'This matches a genuine transactional alert. No action is required unless you did not authorize it.';
      } else {
        riskScore = Math.min(98, Math.max(15, riskScore));
        if (riskScore >= 70) {
          safeAction = '🚨 CRITICAL ADVICE: Do NOT tap any links, do NOT call the provided number, and do NOT download any file. Delete this message immediately and report it.';
        } else if (riskScore >= 40) {
          safeAction = '⚠️ CAUTION: Exercise strong skepticism. Verify with your official bank or service provider through their verified app or website.';
        }
      }

      let riskLevel: 'safe' | 'medium' | 'critical' = 'safe';
      let headline = 'Safe / Low Threat Identified';

      if (riskScore >= 70) {
        riskLevel = 'critical';
        headline = 'HIGH RISK: Malicious Fraud Detected';
      } else if (riskScore >= 40) {
        riskLevel = 'medium';
        headline = 'SUSPICIOUS: Potential Phishing / Social Engineering';
      }

      setAnalysisResult({
        riskScore,
        riskLevel,
        headline,
        detectedFlags: flags.length > 0 ? flags : ['No aggressive phishing patterns found. Sender details appear standard.'],
        safeAction,
        category,
      });

      setIsAnalyzing(false);
      showToast('Analysis complete! Review the threat assessment below.', 'info');
    }, 600);
  };

  const toggleAuditItem = (id: string) => {
    setCheckedAuditIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const auditScorePercent = Math.round((checkedAuditIds.length / AUDIT_CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Hero Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Defense Knowledge Manual</span>
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-md flex items-center gap-1">
              <span>🔒</span>
              <span>Private Guidance</span>
            </span>
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-md">
              CERT-In &amp; RBI Protocols
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight flex items-center gap-2.5">
            <span>💬</span>
            <span>Personal Guide Chat</span>
          </h1>
          <p className="text-sm text-[#45464d] leading-relaxed">
            Your personal digital defense companion. Ask any question about suspicious SMS, calls, or UPI transactions, analyze threats, and audit your security.
          </p>
        </div>

        {/* Quick Action Stat Cards */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-[#f7f9fb] p-3.5 px-4 rounded-2xl border border-[#c6c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold text-lg">
              📞
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                National Helpline
              </span>
              <p className="text-base font-black text-[#ba1a1a]">1930 (Toll-Free)</p>
            </div>
          </div>

          <div className="bg-[#f7f9fb] p-3.5 px-4 rounded-2xl border border-[#c6c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center font-bold text-lg">
              💬
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                Guide Status
              </span>
              <p className="text-base font-black text-[#006f66]">Online &amp; Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#eceef0] rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>💬</span>
          <span>Personal Guide Chat</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-black">
            Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analyzer')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'analyzer'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>🔍</span>
          <span>Scam &amp; Link Analyzer</span>
          <span className="text-[10px] bg-[#ffdcc3] text-[#c76c00] px-1.5 py-0.5 rounded-full font-black">
            Tool
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'emergency'
              ? 'bg-white text-[#ba1a1a] shadow-sm'
              : 'text-[#45464d] hover:text-[#ba1a1a]'
          }`}
        >
          <span>⏱️</span>
          <span>Golden Hour SOS (1930)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-white text-[#006a61] shadow-sm'
              : 'text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          <span>🛡️</span>
          <span>Readiness Audit</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: Personal Guide Chat */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-3xl border border-[#eceef0] shadow-sm overflow-hidden flex flex-col h-[680px]">
              {/* Chat Top Bar */}
              <div className="p-4 md:p-5 border-b border-[#eceef0] bg-[#f7f9fb]/80 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#006a61] text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm md:text-base text-[#191c1e]">
                        Personal Safety Guide
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online &amp; Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-[#76777d]">
                      Private &amp; confidential assistance • Certified RBI &amp; CERT-In Protocols
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const lastMsg = mentorChatHistory[mentorChatHistory.length - 1];
                      if (lastMsg) handleSpeak(lastMsg.text, lastMsg.id);
                    }}
                    className="p-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Listen to latest advice"
                  >
                    <span>🔊</span>
                    <span className="hidden sm:inline">Listen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Chat history refreshed.', 'info');
                    }}
                    className="p-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Refresh Chat"
                  >
                    <span>🔄</span>
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Quick Prompts Carousel Bar */}
              <div className="px-4 py-2.5 bg-[#f7f9fb] border-b border-[#eceef0] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <span>⚡ Quick Topics:</span>
                </span>
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt.query)}
                    className="px-3 py-1 rounded-full bg-white hover:bg-[#86f2e4]/30 hover:border-[#006a61] border border-[#eceef0] text-xs font-bold text-[#191c1e] whitespace-nowrap transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              {/* Message Feed Stream */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-[#fafbfc] to-white">
                {mentorChatHistory.map((msg) => {
                  const isMentor = msg.sender === 'mentor';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 ${isMentor ? 'justify-start' : 'justify-end'}`}
                    >
                      {isMentor && (
                        <div className="w-8 h-8 rounded-full bg-[#006a61] text-white flex items-center justify-center text-sm shadow-xs shrink-0 mt-1">
                          🛡️
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[78%] space-y-2 ${
                          isMentor ? 'items-start' : 'items-end flex flex-col'
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                            isMentor
                              ? 'bg-white border border-[#eceef0] text-[#191c1e] rounded-tl-sm shadow-xs'
                              : 'bg-[#006a61] text-white rounded-tr-sm shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-line font-medium">{msg.text}</p>
                        </div>

                        {/* Interactive Suggestion Options from Mentor */}
                        {isMentor && msg.options && msg.options.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSendMessage(opt)}
                                className="px-3 py-1 rounded-xl bg-white hover:bg-[#86f2e4]/20 border border-[#c6c6cd] hover:border-[#006a61] text-xs font-semibold text-[#006a61] transition-all cursor-pointer shadow-2xs active:scale-95"
                              >
                                {opt} ➔
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message Metadata */}
                        <div className="flex items-center gap-2 text-[10px] text-[#76777d] px-1 font-medium">
                          <span>{msg.timestamp}</span>
                          {isMentor && (
                            <>
                              <span>•</span>
                              <button
                                type="button"
                                onClick={() => handleSpeak(msg.text, msg.id)}
                                className="hover:text-[#006a61] cursor-pointer"
                              >
                                {speakingId === msg.id ? '⏹️ Stop' : '🔊 Listen'}
                              </button>
                              <span>•</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(msg.text, msg.id)}
                                className="hover:text-[#006a61] cursor-pointer"
                              >
                                {copiedId === msg.id ? '✓ Copied' : '📋 Copy'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {!isMentor && (
                        <div className="w-8 h-8 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#006a61] text-white flex items-center justify-center text-sm shadow-xs shrink-0 mt-1">
                      🛡️
                    </div>
                    <div className="bg-white border border-[#eceef0] rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs flex items-center gap-2">
                      <span className="text-xs text-[#76777d] font-medium">Guide is analyzing...</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#006a61] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#006a61] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#006a61] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Dock */}
              <div className="p-3 md:p-4 bg-white border-t border-[#eceef0] space-y-2 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 bg-[#f7f9fb] border border-[#c6c6cd] rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-[#006a61] focus-within:bg-white transition-all shadow-inner"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question or paste a suspicious SMS / URL here..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-[#191c1e] placeholder-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isTyping}
                    className="px-4 py-2.5 bg-[#006a61] hover:bg-[#005049] text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Send</span>
                    <span className="text-base">➔</span>
                  </button>
                </form>

                <div className="flex items-center justify-between text-[11px] text-[#76777d] px-2 font-medium">
                  <span className="flex items-center gap-1">
                    <span>🔒</span>
                    <span>100% Private &amp; Secure Advice</span>
                  </span>
                  <span>Press Enter ↵ to send</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Scam & Link Analyzer Tool */}
          {activeTab === 'analyzer' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  <h3 className="font-extrabold text-xl text-[#191c1e]">
                    Instant Scam &amp; Link Risk Analyzer
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#45464d]">
                  Received a suspicious SMS, WhatsApp message, or link? Paste it below to run our SafeGuard heuristic inspection tool.
                </p>
              </div>

              {/* Preset Test Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#76777d] uppercase tracking-wider block">
                  Click a Sample to Test the Inspector:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_SCAM_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setScannerInput(sample.text);
                        runAnalysis(sample.text);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 bg-[#f7f9fb] hover:bg-white hover:border-[#006a61] text-left text-xs font-bold transition-all text-[#191c1e] flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{sample.label}</span>
                      <span className="text-slate-400 text-xs shrink-0 ml-2">Inspect ➔</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#76777d] font-bold">
                  <span>Enter Message or URL to Inspect:</span>
                  {scannerInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setScannerInput('');
                        setAnalysisResult(null);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Clear text
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  placeholder="Paste suspicious SMS, WhatsApp message, or link here (e.g. 'Dear customer your electricity bill is due tonight...')"
                  className="w-full p-3.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-2xl text-xs md:text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white transition-all font-mono leading-relaxed"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => runAnalysis()}
                disabled={!scannerInput.trim() || isAnalyzing}
                className="w-full py-3.5 bg-[#006a61] hover:bg-[#005049] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-40"
              >
                <span>{isAnalyzing ? 'Analyzing with SafeGuard...' : '🔍 Analyze Content for Threat Signals'}</span>
              </button>

              {/* Analysis Result Display */}
              <AnimatePresence>
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-3xl p-6 border-2 space-y-5 ${
                      analysisResult.riskLevel === 'critical'
                        ? 'bg-red-50/70 border-red-300 text-red-950'
                        : analysisResult.riskLevel === 'medium'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                        : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    }`}
                  >
                    {/* Verdict Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 ${
                            analysisResult.riskLevel === 'critical'
                              ? 'bg-[#ba1a1a]'
                              : analysisResult.riskLevel === 'medium'
                              ? 'bg-[#c76c00]'
                              : 'bg-emerald-600'
                          }`}
                        >
                          {analysisResult.riskLevel === 'critical'
                            ? '🚨'
                            : analysisResult.riskLevel === 'medium'
                            ? '⚠️'
                            : '✅'}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                            {analysisResult.category}
                          </span>
                          <h4 className="font-black text-base md:text-lg">{analysisResult.headline}</h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold block opacity-75">Risk Rating</span>
                        <span className="text-xl font-black">{analysisResult.riskScore} / 100</span>
                      </div>
                    </div>

                    {/* Detected Red Flags */}
                    <div className="space-y-2">
                      <h5 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <span>🚩</span>
                        <span>Identified Threat Signals:</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs">
                        {analysisResult.detectedFlags.map((flag, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-black/5 font-medium"
                          >
                            <span className="font-black shrink-0">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Safe Action */}
                    <div className="p-4 bg-white/90 rounded-2xl border border-black/10 space-y-1.5">
                      <h5 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <span>🛡️</span>
                        <span>Recommended Safe Protocol:</span>
                      </h5>
                      <p className="text-xs leading-relaxed font-semibold">{analysisResult.safeAction}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 3: Golden Hour SOS */}
          {activeTab === 'emergency' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-red-200 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    <h3 className="font-black text-xl text-red-900">
                      The Golden Hour Emergency Defense Protocol
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-red-800/90 leading-relaxed">
                    If you clicked a fake link, shared your OTP, or unauthorized money was debited within the last 2 hours, follow this exact sequence immediately to freeze accounts and recover funds.
                  </p>
                </div>

                <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-black shrink-0">
                  CRITICAL SOS
                </div>
              </div>

              {/* 4-Step Checklist */}
              <div className="space-y-4">
                <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Call 1930 Immediately (National Cyber Helpline)</span>
                    </span>
                    <span className="text-xs font-bold text-red-700">First 2 Hours</span>
                  </div>
                  <p className="text-xs text-red-950 leading-relaxed font-medium">
                    The Indian Cyber Crime Coordination Centre (I4C) can communicate directly with banks to <strong>freeze the scammer's bank account</strong> before they withdraw cash at an ATM.
                  </p>
                  <a
                    href="tel:1930"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#ba1a1a] text-white font-extrabold text-xs rounded-xl shadow hover:bg-red-800 transition-all cursor-pointer"
                  >
                    <span>📞</span>
                    <span>Dial 1930 Now</span>
                  </a>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Freeze Your Debit Card &amp; Block UPI
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Open your mobile banking app (SBI YONO, HDFC MyCards, ICICI iMobile) and toggle OFF: International transactions, Online transactions, and ATM withdrawals. Or send an SMS "BLOCK" to your bank's emergency shortcode.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Revoke UPI Auto-Pay Mandates
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    In Google Pay, PhonePe, or Paytm, go to <strong>Profile ➔ Autopay / Automatic Payments</strong>. Cancel any unknown recurring subscription mandates set up by malicious links.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      File Official Complaint on cybercrime.gov.in
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Save the transaction UTR number, bank statement screenshot, scammer's phone number or WhatsApp chat, and file an FIR complaint online under Financial Fraud.
                  </p>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#006a61] font-bold hover:underline"
                  >
                    <span>Visit Official Portal: cybercrime.gov.in</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Defense Readiness Audit */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eceef0] pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <h3 className="font-extrabold text-xl text-[#191c1e]">
                      Personal Cyber Defense Readiness Audit
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-[#45464d]">
                    Tick the protections you currently have configured to calculate your defense readiness score.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-[#76777d] block uppercase tracking-wider">
                    Readiness Score
                  </span>
                  <span className="text-2xl font-black text-[#006a61]">{auditScorePercent}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#006a61] to-[#86f2e4] rounded-full transition-all duration-500"
                  style={{ width: `${auditScorePercent}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                {AUDIT_CHECKLIST_ITEMS.map((item) => {
                  const isChecked = checkedAuditIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleAuditItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isChecked
                          ? 'bg-[#86f2e4]/15 border-[#86f2e4] text-[#191c1e]'
                          : 'bg-[#f7f9fb] border-[#eceef0] text-[#45464d] hover:border-[#c6c6cd]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-all ${
                          isChecked
                            ? 'bg-[#006a61] border-[#006a61] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-xs md:text-sm">{item.title}</h4>
                        <p className="text-xs text-[#76777d] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Golden Rules Carousel */}
          <div className="bg-gradient-to-br from-[#f7f9fb] to-white rounded-3xl p-6 border border-[#eceef0] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#c76c00] font-black text-xs uppercase tracking-wider">
                <span>⚡</span>
                <span>Rule of Digital Safety:</span>
              </div>
              <div className="flex items-center gap-1">
                {GOLDEN_RULES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveRuleIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeRuleIndex === idx ? 'w-4 bg-[#c76c00]' : 'bg-slate-300'
                    }`}
                    aria-label={`Rule ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{GOLDEN_RULES[activeRuleIndex].icon}</span>
                <h4 className="font-extrabold text-sm text-[#191c1e]">
                  {GOLDEN_RULES[activeRuleIndex].title}
                </h4>
              </div>
              <p className="text-xs text-[#45464d] leading-relaxed">
                {GOLDEN_RULES[activeRuleIndex].desc}
              </p>
              <span className="inline-block text-[10px] font-bold bg-[#ffdcc3] text-[#c76c00] px-2.5 py-0.5 rounded-full">
                {GOLDEN_RULES[activeRuleIndex].badge}
              </span>
            </div>
          </div>

          {/* Quick Helpline Hotline Card */}
          <div className="bg-gradient-to-r from-[#ba1a1a] to-[#93000a] text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                National Cyber Helpline
              </span>
              <span className="text-xl">🚨</span>
            </div>
            <h4 className="font-black text-lg">Call 1930 (Toll-Free)</h4>
            <p className="text-xs text-red-100 leading-relaxed">
              Operated 24x7 by the Ministry of Home Affairs. Call immediately to freeze fraudulent recipient accounts before cash is withdrawn.
            </p>
            <a
              href="tel:1930"
              className="inline-flex items-center gap-1.5 w-full justify-center py-2.5 bg-white text-[#ba1a1a] font-black text-xs rounded-xl shadow hover:bg-red-50 transition-all cursor-pointer"
            >
              <span>📞</span>
              <span>Dial 1930 Now</span>
            </a>
          </div>

          {/* Official Indian Portals Verification Tile */}
          <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-[#191c1e] flex items-center gap-2">
              <span>🏛️</span>
              <span>Official Government Portals</span>
            </h4>
            <p className="text-xs text-[#45464d] leading-relaxed">
              Always verify genuine notices through official Indian portals rather than SMS links:
            </p>

            <div className="space-y-2 text-xs">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#f7f9fb] hover:bg-[#eceef0] flex items-center justify-between font-bold text-[#006a61] transition-all"
              >
                <span>cybercrime.gov.in</span>
                <span>↗</span>
              </a>

              <a
                href="https://sancharsaathi.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#f7f9fb] hover:bg-[#eceef0] flex items-center justify-between font-bold text-[#006a61] transition-all"
              >
                <span>sancharsaathi.gov.in (Block Lost SIM)</span>
                <span>↗</span>
              </a>

              <a
                href="https://cert-in.org.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#f7f9fb] hover:bg-[#eceef0] flex items-center justify-between font-bold text-[#006a61] transition-all"
              >
                <span>cert-in.org.in (Security Advisories)</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
