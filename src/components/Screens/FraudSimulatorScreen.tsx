import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface ScenarioLossData {
  amount: string;
  amountNum: number;
  initialBalance: string;
  finalBalance: string;
  bankName: string;
  notificationTitle: string;
  notificationBody: string;
  breachExplanation: string;
  recoveryAdvice: string[];
}

const SCENARIO_LOSS_MAP: Record<string, ScenarioLossData> = {
  'sim-1': {
    amount: '₹49,999.00',
    amountNum: 49999,
    initialBalance: '₹52,430.50',
    finalBalance: '₹2,431.50',
    bankName: 'HDFC / SBI Bank Alert',
    notificationTitle: '🚨 A/C XX4921: Rs 49,999.00 Debited',
    notificationBody:
      'Rs 49,999.00 debited via NetBanking to "CYBER-FRAUD-MULE". Avl Bal: Rs 2,431.50. If unauthorized, call 1930 immediately.',
    breachExplanation:
      'You clicked the unverified ".cc" link and entered your banking credentials. The scammer intercepted your session token and drained ₹49,999 via instant IMPS transfer!',
    recoveryAdvice: [
      'Call 1930 (National Cyber Crime Helpline) immediately within the Golden Hour.',
      'Log into netbanking from a secure device and freeze all debit cards & UPI IDs.',
      'Visit your nearest bank branch to dispute the unauthorized transaction.',
    ],
  },
  'sim-2': {
    amount: '₹15,000.00',
    amountNum: 15000,
    initialBalance: '₹28,500.00',
    finalBalance: '₹13,500.00',
    bankName: 'Google Pay / UPI Alert',
    notificationTitle: '🚨 Paid ₹15,000.00 to David Merchant',
    notificationBody:
      'UPI Transaction Successful. Money debited from your bank account. UPI Ref #89218491. PIN is only for sending money!',
    breachExplanation:
      'You scanned the QR code and entered your UPI PIN expecting to "receive" cashback. In reality, a PIN is NEVER required to receive money — entering it authorized an outgoing transfer of ₹15,000!',
    recoveryAdvice: [
      'Raise a chargeback dispute on Google Pay / PhonePe app immediately.',
      'Block the buyer contact on WhatsApp and report their UPI VPA handle.',
      'File an urgent report at cybercrime.gov.in under Financial Fraud.',
    ],
  },
  'sim-3': {
    amount: '₹80,000.00',
    amountNum: 80000,
    initialBalance: '₹85,200.00',
    finalBalance: '₹5,200.00',
    bankName: 'Device Security Sentinel',
    notificationTitle: '💀 Critical Ransomware Lockout',
    notificationBody:
      'System files encrypted with AES-256. Remote trojan established by fake support desk. Ransom demanded: ₹80,000.',
    breachExplanation:
      'Calling the toll-free number or trusting the fake pop-up allowed scammers to trick you into downloading AnyDesk/TeamViewer. They accessed your netbanking and drained ₹80,000 while screen-sharing!',
    recoveryAdvice: [
      'Disconnect your device from Wi-Fi / Mobile Internet immediately.',
      'Do not pay the ransom — scammers rarely restore files even after payment.',
      'Boot in Safe Mode and seek certified IT support to wipe the unauthorized remote tool.',
    ],
  },
  'sim-4': {
    amount: '₹98,400.00',
    amountNum: 98400,
    initialBalance: '₹1,12,000.00',
    finalBalance: '₹13,600.00',
    bankName: 'Credit Card Fraud Alert',
    notificationTitle: '🚨 USD 1,200.00 Charged (₹98,400)',
    notificationBody:
      'International transaction approved on card ending 8812 at "DUB-LUXURY-EXCHANGE". If not done by you, block card now.',
    breachExplanation:
      'The phishing email copied Netflix branding to harvest your 16-digit credit card number, CVV, and OTP on an unverified domain. The card was instantly charged ₹98,400 abroad!',
    recoveryAdvice: [
      'Instantly block your credit card via your mobile banking app or SMS "BLOCK" to your bank.',
      'Turn off international online transactions in your banking card controls.',
      'File an unauthorized transaction dispute form with your card issuer.',
    ],
  },
};

export const FraudSimulatorScreen: React.FC = () => {
  const { simulationScenarios, showToast } = useApp();
  const { t } = useTranslation();

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [inspectMode, setInspectMode] = useState(false);
  const [userDecision, setUserDecision] = useState<'report' | 'block' | 'delete' | 'safe' | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [totalProtected, setTotalProtected] = useState(0);
  const [isSimulatingBreach, setIsSimulatingBreach] = useState(false);
  const [showPushNotification, setShowPushNotification] = useState(false);

  // Slide view state for Attack Vectors (2 per slide)
  const ITEMS_PER_SLIDE = 2;
  const totalSlides = Math.ceil(simulationScenarios.length / ITEMS_PER_SLIDE);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideDirection('left');
      setSlideIndex((prev) => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (slideIndex < totalSlides - 1) {
      setSlideDirection('right');
      setSlideIndex((prev) => prev + 1);
    }
  };

  const scenario = simulationScenarios[activeScenarioIndex];
  const lossData = SCENARIO_LOSS_MAP[scenario.id] || SCENARIO_LOSS_MAP['sim-1'];
  const isCompleted = Boolean(userDecision !== null || isSimulatingBreach);

  const triggerBreachSequence = () => {
    setIsSimulatingBreach(true);
    setShowPushNotification(true);
    setUserDecision('safe');
    showToast(`🚨 Breach Triggered! ${lossData.amount} debited from your simulated account.`, 'error');
  };

  const handleAction = (action: 'report' | 'block' | 'delete' | 'safe') => {
    if (action === 'safe') {
      triggerBreachSequence();
      return;
    }

    setUserDecision(action);
    setIsSimulatingBreach(false);
    setShowPushNotification(false);

    const isCorrect =
      (action === 'report' || action === 'block' || action === 'delete') &&
      (action === scenario.correctAction || scenario.correctAction !== 'safe');

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTotalProtected((prev) => prev + lossData.amountNum);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#006a61', '#86f2e4', '#c76c00', '#22c55e'],
        });
      } catch {}
      const toastMsg =
        action === 'delete'
          ? `🗑️ Message Deleted! You safely eliminated the threat and protected ${lossData.amount}.`
          : `🛡️ Threat Neutralized! You protected ${lossData.amount} from fraud.`;
      showToast(toastMsg, 'success');
    } else {
      showToast('Danger! That action was not sufficient to neutralize this scam.', 'error');
    }
  };

  const handleNextScenario = () => {
    setUserDecision(null);
    setInspectMode(false);
    setIsSimulatingBreach(false);
    setShowPushNotification(false);
    setActiveScenarioIndex((prev) => {
      const nextIdx = (prev + 1) % simulationScenarios.length;
      setSlideDirection('right');
      setSlideIndex(Math.floor(nextIdx / ITEMS_PER_SLIDE));
      return nextIdx;
    });
  };

  const handleResetCurrent = () => {
    setUserDecision(null);
    setIsSimulatingBreach(false);
    setShowPushNotification(false);
    setInspectMode(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#ffdcc3] text-[#c76c00] text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{t('sandboxSimulator')}</span>
            </span>
            <span className="text-xs text-[#76777d] font-medium flex items-center gap-1">
              <span>🔒</span>
              <span>{t('safeTestEnv')}</span>
            </span>
            <span className="px-2.5 py-0.5 bg-[#86f2e4]/30 text-[#006f66] text-xs font-bold rounded-md">
              ⚡ Live Phone Simulator
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            {t('interactiveFraudSim')}
          </h1>
          <p className="text-sm text-[#45464d] leading-relaxed">
            {t('simulatorHeaderSub')}
          </p>
        </div>

        {/* Gamified Live Counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#f7f9fb] p-3.5 px-4 rounded-2xl border border-[#c6c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#86f2e4] text-[#006f66] flex items-center justify-center font-bold text-lg">
              🎯
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                {t('simulationsCleared')}
              </span>
              <p className="text-lg font-black text-[#006a61]">
                {score} / {simulationScenarios.length}
              </p>
            </div>
          </div>

          <div className="bg-[#f7f9fb] p-3.5 px-4 rounded-2xl border border-[#c6c6cd] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] text-[#c76c00] flex items-center justify-center font-bold text-lg">
              💰
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider block">
                Total Protected
              </span>
              <p className="text-lg font-black text-[#c76c00]">
                ₹{totalProtected.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selector Navigation: Exactly 2 attack vectors per slide */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#76777d] px-1">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-[#191c1e] font-extrabold flex items-center gap-1.5">
              <span>🎯</span>
              <span>Select Simulation Attack Vector:</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#76777d] font-bold text-[10px]">
              Slide {slideIndex + 1} of {totalSlides} ({slideIndex * ITEMS_PER_SLIDE + 1}–{Math.min((slideIndex + 1) * ITEMS_PER_SLIDE, simulationScenarios.length)} of {simulationScenarios.length})
            </span>
          </div>

          {/* 2 Navigation Arrows + Slide Dots */}
          <div className="flex items-center gap-2">
            {/* Page Dots Indicator */}
            <div className="flex items-center gap-1 mr-1">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx > slideIndex ? 'right' : 'left');
                    setSlideIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    slideIndex === idx ? 'w-5 bg-[#006a61]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={slideIndex === 0}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                slideIndex > 0
                  ? 'border-[#c6c6cd] text-[#191c1e] bg-white hover:bg-[#eceef0] active:scale-95 shadow-xs'
                  : 'border-[#eceef0] text-[#c6c6cd] bg-slate-50 cursor-not-allowed opacity-40'
              }`}
              title="Previous 2 attack vectors"
              aria-label="Previous 2 attack vectors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              disabled={slideIndex >= totalSlides - 1}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                slideIndex < totalSlides - 1
                  ? 'border-[#c6c6cd] text-[#191c1e] bg-white hover:bg-[#eceef0] active:scale-95 shadow-xs'
                  : 'border-[#eceef0] text-[#c6c6cd] bg-slate-50 cursor-not-allowed opacity-40'
              }`}
              title="Next 2 attack vectors"
              aria-label="Next 2 attack vectors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* 2 Attack Vectors Slide Viewport */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, x: slideDirection === 'right' ? 36 : -36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection === 'right' ? -36 : 36 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            >
              {simulationScenarios
                .slice(slideIndex * ITEMS_PER_SLIDE, (slideIndex + 1) * ITEMS_PER_SLIDE)
                .map((sc, localIdx) => {
                  const actualIdx = slideIndex * ITEMS_PER_SLIDE + localIdx;
                  const isSelected = activeScenarioIndex === actualIdx;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setActiveScenarioIndex(actualIdx);
                        handleResetCurrent();
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all border flex items-center justify-between gap-3 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#006a61] text-white border-[#006a61] ring-2 ring-[#86f2e4]/70 shadow-md shadow-[#006a61]/25 scale-[1.01]'
                          : 'bg-white text-[#191c1e] border-[#eceef0] hover:border-[#c6c6cd] hover:bg-[#f7f9fb]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-[#006a61] border border-slate-200'
                          }`}
                        >
                          {sc.type === 'sms'
                            ? '💬'
                            : sc.type === 'upi'
                            ? '📱'
                            : sc.type === 'popup'
                            ? '⚠️'
                            : '✉️'}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : sc.difficulty === 'Beginner'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {sc.difficulty}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                isSelected ? 'text-teal-200' : 'text-[#76777d]'
                              }`}
                            >
                              {sc.type === 'sms'
                                ? 'SMS Phishing'
                                : sc.type === 'upi'
                                ? 'UPI QR Trap'
                                : sc.type === 'popup'
                                ? 'Browser Malware'
                                : 'Email Spoof'}
                            </span>
                          </div>
                          <h4
                            className={`text-xs md:text-sm font-extrabold truncate ${
                              isSelected ? 'text-white' : 'text-[#191c1e]'
                            }`}
                          >
                            {sc.title}
                          </h4>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center pl-2">
                        {isSelected ? (
                          <span className="w-6 h-6 rounded-full bg-white text-[#006a61] flex items-center justify-center text-xs font-black shadow-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#76777d] font-bold px-2 py-1 rounded-lg bg-slate-100 group-hover:bg-slate-200 group-hover:text-slate-900 transition-colors">
                            Select
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Simulation Viewport: Centered initially; slides to the right to reveal Threat Breakdown */}
      <div className="relative w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
        {/* Threat Breakdown Sidebar (Animates into view on the Left when simulation completes) */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              key="threat-breakdown-sidebar"
              initial={{ opacity: 0, x: -24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="order-2 lg:order-1 w-full lg:max-w-xl xl:max-w-2xl space-y-6 shrink-0"
            >
              {/* Main Feedback & Stakes Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
                  <h3 className="font-extrabold text-base text-[#191c1e] flex items-center gap-2">
                    <span>🎓</span>
                    <span>{t('threatBreakdown')}</span>
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#ffdcc3] text-[#c76c00]">
                    Stakes: {lossData.amount}
                  </span>
                </div>

                {/* Result Status Banner */}
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    userDecision === 'safe'
                      ? 'bg-red-50 text-[#93000a] border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm mb-1.5">
                    <span className="text-lg">
                      {userDecision === 'safe' ? '💀' : userDecision === 'delete' ? '🗑️' : '🎉'}
                    </span>
                    <span>
                      {userDecision === 'safe'
                        ? `Financial Loss: ${lossData.amount}`
                        : userDecision === 'delete'
                        ? `Message Deleted — ${lossData.amount} Protected`
                        : `${t('greatDefense')} — ${lossData.amount} Saved`}
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    {userDecision === 'safe'
                      ? lossData.breachExplanation
                      : scenario.explanation}
                  </p>
                </div>

                {/* Real-World Golden Hour Protocol (What to do if this happened) */}
                {userDecision === 'safe' && (
                  <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-900 uppercase tracking-wider">
                      <span>⏱️</span>
                      <span>Golden Hour Emergency Protocol:</span>
                    </div>
                    <ul className="space-y-2 text-xs text-red-800">
                      {lossData.recoveryAdvice.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-red-600 shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Identified Red Flags Checklist */}
                <div className="space-y-2.5 pt-2">
                  <h5 className="font-bold text-xs text-[#191c1e] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🚩</span>
                    <span>{t('identifiedRedFlags')}</span>
                  </h5>
                  <ul className="space-y-2 text-xs text-[#45464d]">
                    {scenario.redFlags.map((flag, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 bg-[#f7f9fb] p-2.5 rounded-xl border border-[#eceef0]"
                      >
                        <span className="text-[#ba1a1a] font-black text-sm leading-none shrink-0">
                          •
                        </span>
                        <span className="leading-snug">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetCurrent}
                    className="flex-1 py-3 bg-[#f7f9fb] text-[#191c1e] border border-[#c6c6cd] font-bold text-xs rounded-xl hover:bg-[#eceef0] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>🔄</span>
                    <span>Re-test Scenario</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="flex-1 py-3 bg-[#006a61] text-white font-bold text-xs rounded-xl hover:bg-[#005049] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                  >
                    <span>{t('tryNextSimulation')}</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>

              {/* Quick Helpline & Emergency Guide Tile */}
              <div className="bg-gradient-to-r from-[#006a61] to-[#004d46] text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Emergency Cyber Defense
                  </span>
                  <span className="text-lg">📞</span>
                </div>
                <h4 className="font-black text-lg">National Cyber Crime Helpline: 1930</h4>
                <p className="text-xs text-teal-100 leading-relaxed">
                  If you or anyone you know ever enters details on a phishing site or loses money, call{' '}
                  <strong>1930</strong> within 2 hours to freeze the recipient account before money is
                  withdrawn.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone Module (Centered in middle of page initially; slides to Right upon completion) */}
        <motion.div
          layout
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="order-1 lg:order-2 space-y-4 w-full max-w-[420px] shrink-0"
        >
          {/* Phone Canvas Container (Isolated stacking context to prevent glitching with sticky headers) */}
          <div className="isolate relative z-0 mx-auto w-full max-w-[420px] rounded-[48px] bg-[#1e2329] p-3.5 shadow-2xl ring-1 ring-slate-900/10 border-[6px] border-[#2b313a]">
            {/* Phone Hardware Shell Accents */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-700/60 rounded-full" />
            <div className="absolute -left-[9px] top-28 w-[3px] h-9 bg-slate-700 rounded-l" />
            <div className="absolute -left-[9px] top-40 w-[3px] h-9 bg-slate-700 rounded-l" />
            <div className="absolute -right-[9px] top-32 w-[3px] h-12 bg-slate-700 rounded-r" />

            {/* Inner Phone Screen Display */}
            <motion.div
              animate={
                isSimulatingBreach
                  ? {
                      x: [-6, 6, -5, 5, -2, 2, 0],
                      transition: { duration: 0.5 },
                    }
                  : {}
              }
              className="relative w-full rounded-[38px] bg-[#f2f4f7] h-[670px] flex flex-col overflow-hidden text-[#191c1e] shadow-inner select-none"
            >
              {/* Dynamic Island & Status Bar (Pinned cleanly at top) */}
              <div className="shrink-0 bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold z-20">
                <span className="font-bold text-[13px] tracking-tight">10:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#86f2e4] animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span>5G</span>
                  <span>📶</span>
                  <span>98%</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Messages / App Header Inside Phone */}
              <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold text-lg leading-none cursor-pointer">
                    ‹
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    {scenario.type === 'sms'
                      ? '🏦'
                      : scenario.type === 'upi'
                      ? '👤'
                      : scenario.type === 'popup'
                      ? '🛡️'
                      : '🎬'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate max-w-[170px]">
                        {scenario.mockSender}
                      </h4>
                      {inspectMode && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {scenario.type === 'sms'
                        ? 'SMS • Priority Alert'
                        : scenario.type === 'upi'
                        ? 'WhatsApp Payment'
                        : scenario.type === 'popup'
                        ? 'Browser Warning'
                        : 'Official Mail'}
                    </p>
                  </div>
                </div>

                {/* Phone Header Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Delete Option directly in phone header */}
                  <button
                    type="button"
                    onClick={() => handleAction('delete')}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 border bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 active:scale-95 cursor-pointer shadow-2xs"
                    title="Delete message from phone"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Scenario Context Hint Ribbon */}
              <div className="shrink-0 bg-amber-50/90 border-b border-amber-200 px-4 py-1.5 text-[11px] text-amber-900 flex items-center gap-1.5 z-10">
                <span className="text-xs">💡</span>
                <span className="truncate">{scenario.scenarioDescription}</span>
              </div>

              {/* Realistic Dropdown Bank Push Notification (Breach Alert) */}
              <AnimatePresence>
                {showPushNotification && (
                  <motion.div
                    key="bank-push-notif"
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                    className="absolute top-11 left-2.5 right-2.5 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-[#ba1a1a] shadow-2xl flex items-start gap-2.5 text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center text-base shrink-0 font-bold">
                      🚨
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black text-[#ba1a1a] uppercase tracking-wide">
                          {lossData.bankName}
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium">Just now</span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-900 leading-tight">
                        {lossData.notificationTitle}
                      </p>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {lossData.notificationBody}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone Content Screen Area (Dedicated viewport with clean overlay layering) */}
              <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* Visual Breach Takeover Screen if Link Was Clicked */}
                <AnimatePresence>
                  {isSimulatingBreach && (
                    <motion.div
                      key="breach-overlay"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-0 z-20 bg-[#ba1a1a]/95 backdrop-blur-md p-4 text-white flex flex-col items-center justify-between text-center overflow-y-auto"
                    >
                      <div className="space-y-2 mt-2">
                        <div className="w-14 h-14 rounded-full bg-white/20 mx-auto flex items-center justify-center text-2xl animate-bounce">
                          💸
                        </div>
                        <span className="px-3 py-1 bg-white text-[#ba1a1a] text-[10px] font-black rounded-full uppercase tracking-wider">
                          Money Debited!
                        </span>
                        <h3 className="text-2xl font-black tracking-tight text-white">
                          -{lossData.amount}
                        </h3>
                        <p className="text-[11px] text-red-100 font-medium">
                          Simulated financial loss from unauthorized transaction
                        </p>
                      </div>

                      {/* Compromised Account Balance Breakdown */}
                      <div className="w-full bg-black/30 rounded-2xl p-3 text-left space-y-1.5 border border-white/20 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-red-200">Starting Balance:</span>
                          <span className="font-semibold line-through text-red-200">
                            {lossData.initialBalance}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-black text-xs">
                          <span className="text-white">Remaining Balance:</span>
                          <span className="text-yellow-300 font-black">{lossData.finalBalance}</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/10 text-[10px] text-red-100 leading-relaxed">
                          ⚠️ <strong>Trigger:</strong> Phishing link was clicked & your simulated
                          credentials were transmitted to cybercriminals.
                        </div>
                      </div>

                      <div className="w-full space-y-1.5 mb-1">
                        <button
                          type="button"
                          onClick={handleResetCurrent}
                          className="w-full py-2.5 bg-white text-[#ba1a1a] font-black text-xs rounded-xl shadow-lg hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>🔄</span>
                          <span>Rewind & Try Again</span>
                        </button>
                        <p className="text-[9px] text-red-200">
                          Inspect the red flags on the right to see how to prevent this.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Successful Defense Shield Screen */}
                <AnimatePresence>
                  {userDecision && userDecision !== 'safe' && (
                    <motion.div
                      key="defense-overlay"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-0 z-20 bg-[#006a61]/95 backdrop-blur-md p-4 text-white flex flex-col items-center justify-between text-center overflow-y-auto"
                    >
                      <div className="space-y-2 mt-4">
                        <div className="w-14 h-14 rounded-full bg-white/20 mx-auto flex items-center justify-center text-2xl">
                          {userDecision === 'delete' ? '🗑️' : '🛡️'}
                        </div>
                        <span className="px-3 py-1 bg-white text-[#006a61] text-[10px] font-black rounded-full uppercase tracking-wider">
                          {userDecision === 'delete' ? 'Message Deleted' : 'Threat Neutralized'}
                        </span>
                        <h3 className="text-xl font-black tracking-tight text-white">
                          ₹0 Lost • 100% Protected
                        </h3>
                        <p className="text-[11px] text-teal-100 font-medium">
                          {userDecision === 'delete'
                            ? 'You safely deleted the fraudulent message before any links were opened!'
                            : 'You identified the deceit and took the correct defense action!'}
                        </p>
                      </div>

                      <div className="w-full bg-black/20 rounded-2xl p-3 text-left space-y-1.5 text-xs border border-white/20">
                        <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                          <span>✅</span>
                          <span>Saved Amount: {lossData.amount}</span>
                        </div>
                        <p className="text-[10px] text-teal-100 leading-relaxed">
                          {userDecision === 'delete'
                            ? `Your account balance remains intact at ${lossData.initialBalance}. Deleting scam messages stops phishing attacks immediately.`
                            : `Your account balance remains intact at ${lossData.initialBalance}. The sender has been flagged in the SafeGuard threat registry.`}
                        </p>
                      </div>

                      <div className="w-full space-y-1 mb-1">
                        <button
                          type="button"
                          onClick={handleNextScenario}
                          className="w-full py-2.5 bg-[#86f2e4] text-[#006f66] font-black text-xs rounded-xl shadow-lg hover:bg-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>{t('tryNextSimulation')}</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulated Conversation Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] bg-slate-200/80 text-slate-600 px-3 py-1 rounded-full font-bold">
                      Today • 10:41 AM
                    </span>
                  </div>

                  {/* Scenario 1: Bank SMS */}
                  {scenario.type === 'sms' && (
                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                          💬
                        </div>
                        <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-xs p-4 shadow-sm border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-b border-slate-100 pb-1.5">
                            <span className="text-slate-700 font-bold">URGENT NOTIFICATION</span>
                            <span>10:41 AM</span>
                          </div>
                          <p
                            className={`text-xs text-slate-800 leading-relaxed ${
                              inspectMode
                                ? 'bg-amber-50 p-2 rounded-lg border border-amber-300'
                                : ''
                            }`}
                          >
                            {scenario.mockContent}
                          </p>

                          {/* Clickable Realistic Phishing Link */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={triggerBreachSequence}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono break-all transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                                inspectMode
                                  ? 'bg-red-50 border-red-300 text-red-700 ring-2 ring-red-400'
                                  : 'bg-blue-50/70 border-blue-200 text-blue-700 hover:bg-blue-100'
                              }`}
                            >
                              <span className="underline font-semibold truncate">
                                {scenario.fakeLinkOrTarget}
                              </span>
                              <span className="shrink-0 text-slate-400 group-hover:text-blue-600 font-bold">
                                ↗
                              </span>
                            </button>
                            <span className="text-[10px] text-slate-500 mt-1 block italic">
                              💡 Tip: Tap the link to test what happens if you click it.
                            </span>
                          </div>

                          {/* In-Message Action Bar on Phone */}
                          <div className="pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">Message Action:</span>
                            <button
                              type="button"
                              onClick={() => handleAction('delete')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700 font-semibold text-[11px] rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="Delete this message"
                            >
                              <span>🗑️</span>
                              <span>Delete Message</span>
                            </button>
                          </div>

                          {/* Inspection Annotation Markers */}
                          {inspectMode && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-[11px] bg-amber-100/90 text-amber-900 p-2.5 rounded-xl space-y-1 font-semibold border border-amber-300"
                            >
                              <p>⚠️ <strong>Urgency Hook:</strong> "Within 2 hours" triggers panic.</p>
                              <p>⚠️ <strong>Fake Domain:</strong> Uses ".cc" instead of official ".com".</p>
                              <p>⚠️ <strong>Insecure:</strong> Sent over HTTP instead of HTTPS.</p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 block text-right pr-2">
                        Delivered
                      </span>
                    </div>
                  )}

                  {/* Scenario 2: UPI / QR Code Scam */}
                  {scenario.type === 'upi' && (
                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">
                          ₹
                        </div>
                        <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-xs p-4 shadow-sm border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold border-b border-slate-100 pb-1.5">
                            <span className="text-emerald-700 font-black">UPI PAYMENT REQUEST</span>
                            <span>10:41 AM</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed">
                            {scenario.mockContent}
                          </p>

                          {/* Realistic Simulated QR Code Box */}
                          <div
                            onClick={triggerBreachSequence}
                            className={`p-3 bg-slate-50 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-100 ${
                              inspectMode
                                ? 'border-amber-400 bg-amber-50/50'
                                : 'border-slate-300'
                            }`}
                          >
                            <div className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center text-center">
                              <span className="material-symbols-outlined text-6xl text-slate-800">
                                qr_code_2
                              </span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                              Tap QR code to scan
                            </span>
                          </div>

                          {/* In-Message Action Bar on Phone */}
                          <div className="pt-1 flex items-center justify-between border-t border-slate-100 gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">Payment Action:</span>
                            <button
                              type="button"
                              onClick={() => handleAction('delete')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700 font-semibold text-[11px] rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="Delete payment request"
                            >
                              <span>🗑️</span>
                              <span>Delete Request</span>
                            </button>
                          </div>

                          {inspectMode && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-[11px] bg-amber-100/90 text-amber-900 p-2.5 rounded-xl space-y-1 font-semibold border border-amber-300"
                            >
                              <p>⚠️ <strong>Golden Rule:</strong> You NEVER enter your PIN to receive money.</p>
                              <p>⚠️ <strong>Scam Tactic:</strong> Buyer claims this QR will credit your account.</p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scenario 3: Windows / Mobile Virus Alert */}
                  {scenario.type === 'popup' && (
                    <div className="space-y-3">
                      <div className="bg-[#ba1a1a] text-white rounded-2xl p-4 shadow-lg space-y-3 border-2 border-red-400">
                        <div className="flex items-center gap-2 border-b border-red-400/50 pb-2">
                          <span className="text-xl animate-pulse">🚨</span>
                          <div>
                            <h4 className="font-black text-xs uppercase tracking-wide">
                              System Alert: Trojan Detected
                            </h4>
                            <p className="text-[10px] text-red-200">Critical Threat #0x80070002</p>
                          </div>
                        </div>
                        <p className="text-xs text-red-100 leading-relaxed font-medium">
                          {scenario.mockContent}
                        </p>

                        <button
                          type="button"
                          onClick={triggerBreachSequence}
                          className="w-full py-2.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>📞</span>
                          <span>Call 1-888-992-0199</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAction('delete')}
                          className="w-full py-2 bg-red-950/70 hover:bg-red-950 text-white font-bold text-xs rounded-xl border border-red-400/50 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <span>🗑️</span>
                          <span>Delete & Close Alert</span>
                        </button>

                        {inspectMode && (
                          <div className="text-[11px] bg-white text-slate-900 p-2.5 rounded-xl space-y-1 font-semibold">
                            <p>⚠️ <strong>Browser Trap:</strong> Operating systems never display phone numbers in web browser tabs.</p>
                            <p>⚠️ <strong>Goal:</strong> Tricking you into installing AnyDesk to drain your bank account.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Scenario 4: Netflix Email */}
                  {scenario.type === 'email' && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
                      <div className="border-b border-slate-100 pb-2 space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900">Netflix Support</span>
                          <span className="text-slate-400 text-[10px]">10:41 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {scenario.mockSender}
                        </p>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {scenario.mockContent}
                      </p>

                      <button
                        type="button"
                        onClick={triggerBreachSequence}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Update Payment Method</span>
                        <span className="text-slate-500 font-bold">↗</span>
                      </button>

                      {/* In-Message Action Bar on Phone */}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-100 gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">Mail Action:</span>
                        <button
                          type="button"
                          onClick={() => handleAction('delete')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700 font-semibold text-[11px] rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                          title="Delete email"
                        >
                          <span>🗑️</span>
                          <span>Delete Email</span>
                        </button>
                      </div>

                      {inspectMode && (
                        <div className="text-[11px] bg-amber-100/90 text-amber-900 p-2.5 rounded-xl space-y-1 font-semibold border border-amber-300">
                          <p>⚠️ <strong>Lookalike Domain:</strong> "netflx-account-renew.com" is missing the "i" in Netflix.</p>
                          <p>⚠️ <strong>Generic Salutation:</strong> Addresses you as "Hi Friend" instead of your name.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Simulated Mobile Keyboard / Text Input Dock */}
                <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex items-center justify-between gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => handleAction('delete')}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90"
                    title="Delete message"
                  >
                    🗑️
                  </button>
                  <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-xs text-slate-400">
                    Text Message...
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#006a61] text-white flex items-center justify-center text-xs">
                    ↑
                  </div>
                </div>
              </div>

              {/* Bottom Home Indicator Bar on phone */}
              <div className="bg-white pb-2 pt-1 flex justify-center">
                <div className="w-32 h-1 bg-slate-400 rounded-full" />
              </div>
            </motion.div>
          </div>

          {/* Realistic Decision Action Dock Below Phone */}
          <div className="bg-white rounded-3xl p-5 border border-[#eceef0] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#191c1e] px-1">
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span>
                <span>{t('whatActionWillYouTake')}</span>
              </span>
              <span className="text-[#76777d]">Simulate response</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Report a Scam */}
              <button
                type="button"
                onClick={() => handleAction('report')}
                className="py-3.5 px-4 bg-[#006a61] text-white font-extrabold text-sm rounded-2xl hover:bg-[#005049] transition-all flex items-center justify-center gap-3 shadow-md shadow-[#006a61]/20 active:scale-98 cursor-pointer"
              >
                <span className="text-xl">🚨</span>
                <div className="text-left">
                  <span className="block leading-tight">{t('reportScamBtn')}</span>
                  <span className="text-[10px] text-teal-100 font-medium block">Safely flag & neutralize threat</span>
                </div>
              </button>

              {/* Option 2: Open Link */}
              <button
                type="button"
                onClick={() => handleAction('safe')}
                className="py-3.5 px-4 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] border-2 border-[#ffb4ab] font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm active:scale-98 cursor-pointer"
              >
                <span className="text-xl">⚠️</span>
                <div className="text-left">
                  <span className="block leading-tight">Open Link</span>
                  <span className="text-[10px] text-red-800/80 font-medium block">Proceed & test consequences</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
