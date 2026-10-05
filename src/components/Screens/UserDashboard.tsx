import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion, AnimatePresence } from 'motion/react';

export const UserDashboard: React.FC = () => {
  const { currentUser, modules, openLesson, setCurrentScreen, showToast } = useApp();
  const { t } = useTranslation();
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Determine the "current" module (first incomplete one)
  const currentModuleIndex = modules.findIndex((m) => !m.isCompleted);
  const completedCount = modules.filter((m) => m.isCompleted).length;

  // Calculate streak (mock: based on completedModules)
  const streakDays = Math.max(1, currentUser.completedModules + 2);

  // Timeline scroll helpers
  const checkScrollability = () => {
    const el = timelineRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener('scroll', checkScrollability);
    return () => el.removeEventListener('scroll', checkScrollability);
  }, []);

  const scrollTimeline = (direction: 'left' | 'right') => {
    const el = timelineRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Score color based on value
  const scoreColor =
    currentUser.securityScore >= 80
      ? '#22c55e'
      : currentUser.securityScore >= 60
      ? '#86f2e4'
      : currentUser.securityScore >= 40
      ? '#fbbf24'
      : '#ef4444';

  const scoreLabel =
    currentUser.securityScore >= 80
      ? t('scoreExcellent')
      : t('scoreGood');

  return (
    <div className="space-y-8 pb-12">
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — IMMERSIVE HERO BANNER
          Full-width gradient with glowing radial gauge + stat chips
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #0f1729 0%, #131b2e 30%, #0a3d38 70%, #006a61 100%)',
        }}
      >
        {/* Subtle animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.06]"
            style={{
              background: 'radial-gradient(circle, #86f2e4 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.04]"
            style={{
              background: 'radial-gradient(circle, #86f2e4 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]"
            style={{
              background: 'radial-gradient(circle, #86f2e4 0%, transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Left — Welcome Text */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-[#86f2e4] rounded-full text-[11px] font-bold uppercase tracking-wider border border-white/10">
                {currentUser.level || 'Level 2 Explorer'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t('welcomeBack')}{' '}
              <span className="bg-gradient-to-r from-[#86f2e4] to-[#4dd9c8] bg-clip-text text-transparent">
                {currentUser.name}
              </span>
              !
            </h1>
            <p className="text-sm text-gray-300/80 max-w-md">
              {t('completedModulesText', {
                completed: currentUser.completedModules,
                total: currentUser.totalModules,
              })}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
              <button
                onClick={() => {
                  const nextModule = modules.find((m) => !m.isCompleted);
                  if (nextModule) openLesson(nextModule);
                }}
                className="px-5 py-2.5 bg-[#86f2e4] text-[#0a3d38] text-sm font-bold rounded-xl hover:bg-[#6ee0d0] active:scale-95 transition-all shadow-lg shadow-[#86f2e4]/20"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  {t('continue')} Learning
                </span>
              </button>
              <button
                onClick={() => setCurrentScreen('my_progress')}
                className="px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/15 transition-all border border-white/10 backdrop-blur-sm"
              >
                {t('viewAllProgress')}
              </button>
            </div>
          </div>

          {/* Center — Glowing Security Score Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Outer glow ring */}
            <div
              className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full blur-2xl opacity-20"
              style={{ backgroundColor: scoreColor }}
            />

            {/* The gauge */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />
                {/* Active arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${currentUser.securityScore * 2.64} ${264 - currentUser.securityScore * 2.64}`}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 6px ${scoreColor})`,
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
                  {currentUser.securityScore}
                </span>
                <span className="text-[10px] md:text-xs text-gray-300 font-semibold uppercase tracking-wider mt-0.5">
                  {t('securityScore')}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Floating Glass Stat Chips */}
          <div className="flex md:flex-col gap-3 shrink-0">
            {/* Completed stat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[120px] hover:bg-white/[0.12] transition-colors"
            >
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <span className="text-sm">📚</span> Completed
              </p>
              <p className="text-2xl font-black text-white mt-1 tabular-nums">
                {currentUser.completedModules}
                <span className="text-sm font-semibold text-gray-400">/{currentUser.totalModules}</span>
              </p>
              {/* Mini progress bar */}
              <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentUser.completedModules / currentUser.totalModules) * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="h-1 rounded-full bg-gradient-to-r from-[#86f2e4] to-[#4dd9c8]"
                />
              </div>
            </motion.div>

            {/* Level stat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[120px] hover:bg-white/[0.12] transition-colors"
            >
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <span className="text-sm">🧭</span> Level
              </p>
              <p className="text-lg font-extrabold bg-gradient-to-r from-[#86f2e4] to-[#4dd9c8] bg-clip-text text-transparent mt-1">
                Explorer
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Rank 2 of 5</p>
            </motion.div>

            {/* Streak stat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[120px] hover:bg-white/[0.12] transition-colors"
            >
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <motion.span
                  animate={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
                  className="text-sm inline-block"
                >
                  🔥
                </motion.span>
                Streak
              </p>
              <p className="text-2xl font-black text-white mt-1 tabular-nums">
                {streakDays}
                <span className="text-sm font-semibold text-gray-400 ml-1">days</span>
              </p>
            </motion.div>
          </div>

        </div>

        {/* Bottom score badge row */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pb-5 pt-0">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
              style={{
                background: `${scoreColor}20`,
                color: scoreColor,
              }}
            >
              {scoreLabel}
            </span>
            <span className="text-xs text-gray-400">{t('wellGuarded')}</span>
          </div>
          <button
            onClick={() => setCurrentScreen('privacy_settings')}
            className="text-xs text-[#86f2e4] font-bold hover:underline flex items-center gap-1 hover:text-[#a0fff0] transition-colors"
          >
            {t('boostScore')}
          </button>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — YOUR LEARNING JOURNEY (Horizontal Timeline)
      ═══════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
              Your Learning Journey
            </h2>
            <p className="text-xs text-[#45464d] mt-0.5">
              {t('clickModuleHint')}
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTimeline('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-[#c6c6cd] text-[#191c1e] hover:bg-[#eceef0] active:scale-95'
                  : 'border-[#eceef0] text-[#c6c6cd] cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={() => scrollTimeline('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-[#c6c6cd] text-[#191c1e] hover:bg-[#eceef0] active:scale-95'
                  : 'border-[#eceef0] text-[#c6c6cd] cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Timeline scroll container */}
        <div
          ref={timelineRef}
          className="flex gap-0 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {modules.map((mod, index) => {
            const isCurrent = index === currentModuleIndex;
            const isCompleted = mod.isCompleted;
            const isUpcoming = !isCompleted && !isCurrent;
            const isLast = index === modules.length - 1;

            return (
              <div
                key={mod.id}
                className="flex items-stretch shrink-0 snap-start"
              >
                {/* Module Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => openLesson(mod)}
                  className={`
                    relative flex flex-col justify-between rounded-2xl p-5 cursor-pointer transition-all group
                    ${isCurrent ? 'w-[260px] md:w-[280px]' : 'w-[220px] md:w-[240px]'}
                    ${
                      isCurrent
                        ? 'bg-white border-2 border-[#006a61] shadow-lg shadow-[#006a61]/10 ring-2 ring-[#006a61]/10'
                        : isCompleted
                        ? 'bg-white border border-[#86f2e4] shadow-sm hover:shadow-md hover:border-[#006a61]'
                        : 'bg-[#f7f9fb] border border-[#eceef0] shadow-xs hover:shadow-md hover:border-[#c6c6cd]'
                    }
                  `}
                  style={{
                    minHeight: isCurrent ? '210px' : '190px',
                  }}
                >
                  {/* Status Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isCurrent
                            ? 'bg-[#006a61] text-white'
                            : isCompleted
                            ? 'bg-[#86f2e4]/30 text-[#006a61]'
                            : 'bg-[#eceef0] text-[#76777d]'
                        }`}
                      >
                        {isCurrent ? 'Current' : isCompleted ? t('completedBadge') : 'Upcoming'}
                      </span>

                      {isCompleted && (
                        <span className="w-7 h-7 rounded-full bg-[#86f2e4] text-[#006a61] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-bold leading-snug mt-1 transition-colors ${
                        isUpcoming
                          ? 'text-[#76777d] group-hover:text-[#45464d]'
                          : 'text-[#191c1e] group-hover:text-[#006a61]'
                      }`}
                    >
                      Module {mod.number}
                    </h3>
                    <p
                      className={`text-[13px] font-semibold leading-snug mt-0.5 ${
                        isUpcoming ? 'text-[#9c9ca4]' : 'text-[#45464d]'
                      }`}
                    >
                      {mod.title}
                    </p>

                    {isCurrent && (
                      <p className="text-xs text-[#76777d] mt-1.5 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    )}
                  </div>

                  {/* Progress / Meta */}
                  <div className="mt-3 pt-3 border-t border-[#eceef0]">
                    {isCompleted ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#006a61] font-bold">
                          {mod.quizScore ? `Quiz: ${mod.quizScore}%` : '100%'}
                        </span>
                        <span className="text-[#006a61] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t('review')}
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[#76777d] font-medium">
                            {mod.estimatedMinutes} {t('mins')}
                          </span>
                          <span className={`font-bold ${isCurrent ? 'text-[#006a61]' : 'text-[#76777d]'}`}>
                            {mod.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-[#eceef0] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-700 ${
                              isCurrent ? 'bg-[#006a61]' : 'bg-[#c6c6cd]'
                            }`}
                            style={{ width: `${mod.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-[#9c9ca4]">
                            {mod.steps.length} {t('interactiveSteps')}
                          </span>
                          <span
                            className={`font-bold flex items-center gap-1 transition-transform group-hover:translate-x-1 ${
                              isCurrent ? 'text-[#006a61]' : 'text-[#76777d]'
                            }`}
                          >
                            {mod.progressPercent > 0 ? t('continue') : t('start')}
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Connector line between cards */}
                {!isLast && (
                  <div className="flex items-center justify-center w-8 md:w-10 shrink-0">
                    <div className="flex items-center gap-[3px]">
                      {[...Array(4)].map((_, dotIdx) => (
                        <div
                          key={dotIdx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            index < currentModuleIndex
                              ? 'bg-[#86f2e4]'
                              : 'bg-[#d4d6da]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress indicator dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {modules.map((mod, i) => (
            <div
              key={mod.id}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentModuleIndex
                  ? 'w-6 bg-[#006a61]'
                  : mod.isCompleted
                  ? 'w-3 bg-[#86f2e4]'
                  : 'w-3 bg-[#d4d6da]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — WEEKLY REMINDER ALERT BANNER
      ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!reminderDismissed && (
          <motion.section
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-2xl px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 border"
              style={{
                background: 'linear-gradient(90deg, #fff7ed 0%, #fef3c7 50%, #fff7ed 100%)',
                borderColor: '#fbbf24',
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/20 text-[#b45309] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#b45309]">
                      {t('weeklyReminder')}
                    </span>
                    <span className="hidden sm:inline text-xs text-[#92400e]/60">•</span>
                    <span className="hidden sm:inline text-xs text-[#92400e]/60">{t('routineCheck')}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#78350f] mt-0.5">
                    {t('weeklyReminderTitle')}
                  </p>
                  <p className="text-xs text-[#92400e]/80 mt-0.5 hidden sm:block">
                    {t('weeklyReminderDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setReminderDismissed(true);
                    showToast('Reminder checked off. Great habit!', 'success');
                  }}
                  className="px-4 py-2 bg-[#b45309] text-white text-xs font-bold rounded-xl hover:bg-[#92400e] active:scale-95 transition-all shadow-sm"
                >
                  {t('doneCheck')} ✓
                </button>
                <button
                  onClick={() => setReminderDismissed(true)}
                  className="p-1.5 text-[#b45309]/50 hover:text-[#78350f] rounded-lg hover:bg-[#fbbf24]/20 transition-colors"
                  title="Dismiss"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — ACTION TILES WITH LIVE PREVIEWS
      ═══════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
            {t('quickSafetyActions')}
          </h2>
          <p className="text-xs text-[#45464d] mt-0.5">{t('quickSafetyActionsSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* ── Fraud Simulator Tile ── */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('fraud_simulator')}
            className="bg-white rounded-3xl border border-[#eceef0] shadow-sm hover:shadow-xl hover:border-[#006a61]/30 transition-all text-left overflow-hidden group"
          >
            {/* Preview area */}
            <div className="relative h-40 bg-gradient-to-br from-[#0f1729] to-[#0a3d38] flex items-center justify-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-3 left-3 w-20 h-3 bg-white/30 rounded-full" />
                <div className="absolute top-3 right-3 w-6 h-3 bg-[#86f2e4]/40 rounded-full" />
                <div className="absolute top-9 left-3 w-32 h-2 bg-white/20 rounded-full" />
                <div className="absolute top-13 left-3 w-24 h-2 bg-white/15 rounded-full" />
                <div className="absolute bottom-12 left-3 right-3 h-8 bg-white/10 rounded-lg" />
                <div className="absolute bottom-3 right-3 w-16 h-6 bg-[#ef4444]/30 rounded-md" />
                <div className="absolute bottom-3 left-3 w-16 h-6 bg-[#86f2e4]/30 rounded-md" />
              </div>

              {/* Shield icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#86f2e4]/20 backdrop-blur-sm border border-[#86f2e4]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span
                    className="material-symbols-outlined text-[32px] text-[#86f2e4]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    security
                  </span>
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-[#86f2e4]/20 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#006a61] transition-colors">
                {t('fraudSimulator')}
              </h3>
              <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                {t('fraudSimulatorSub')}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-bold text-[#006a61] group-hover:translate-x-1 transition-transform">
                <span>Launch Simulator</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </motion.button>

          {/* ── Personal Guide Chat Tile ── */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('personal_guide')}
            className="bg-white rounded-3xl border border-[#eceef0] shadow-sm hover:shadow-xl hover:border-[#006a61]/30 transition-all text-left overflow-hidden group"
          >
            {/* Chat preview area */}
            <div className="relative h-40 bg-gradient-to-br from-[#f0fdf9] to-[#e6f7f3] flex flex-col justify-end p-3 gap-2 overflow-hidden">
              {/* Guardian guide message */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#006a61] text-white flex items-center justify-center shrink-0 text-xs">
                  🛡️
                </div>
                <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-xs border border-[#eceef0] max-w-[85%]">
                  <p className="text-[11px] text-[#45464d] leading-relaxed">
                    Welcome! Ask me anything about suspicious SMS, calls, or UPI links. 🛡️
                  </p>
                </div>
              </div>
              {/* User message */}
              <div className="flex items-start gap-2 self-end">
                <div className="bg-[#006a61] text-white rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                  <p className="text-[11px] leading-relaxed">
                    Is this electricity bill SMS real? 🤔
                  </p>
                </div>
              </div>
              {/* Guide active pulse */}
              <div className="flex items-center gap-1.5 ml-8 text-[10px] text-[#006a61] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-ping" />
                <span>Personal Safety Guide Ready</span>
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#006a61] transition-colors">
                {t('askPersonalGuide')}
              </h3>
              <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                {t('askPersonalGuideSub')}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-bold text-[#006a61] group-hover:translate-x-1 transition-transform">
                <span>Start Chat</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </motion.button>

          {/* ── Report Scam Tile ── */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('report_scam')}
            className="bg-white rounded-3xl border border-[#eceef0] shadow-sm hover:shadow-xl hover:border-[#006a61]/30 transition-all text-left overflow-hidden group"
          >
            {/* Form preview area */}
            <div className="relative h-40 bg-gradient-to-br from-[#fef2f2] to-[#fce7f3] p-3 overflow-hidden">
              <div className="bg-white rounded-xl p-3 shadow-xs border border-[#eceef0] space-y-2.5 h-full">
                {/* Mini form fields */}
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#76777d] uppercase tracking-wider">Scam Type</p>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 bg-[#ffdad6] text-[#ba1a1a] text-[9px] font-bold rounded-md">SMS</span>
                    <span className="px-2 py-0.5 bg-[#eceef0] text-[#76777d] text-[9px] font-bold rounded-md">Email</span>
                    <span className="px-2 py-0.5 bg-[#eceef0] text-[#76777d] text-[9px] font-bold rounded-md">Call</span>
                    <span className="px-2 py-0.5 bg-[#eceef0] text-[#76777d] text-[9px] font-bold rounded-md">Web</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#76777d] uppercase tracking-wider">Description</p>
                  <div className="h-6 bg-[#f7f9fb] rounded-md border border-[#eceef0]" />
                </div>
                <div className="flex justify-end pt-0.5">
                  <span className="px-3 py-1 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-md">
                    Submit Report
                  </span>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#006a61] transition-colors">
                {t('reportScam')}
              </h3>
              <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                {t('reportScamSub')}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-bold text-[#ba1a1a] group-hover:translate-x-1 transition-transform">
                <span>File a Report</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </motion.button>
        </div>
      </section>
    </div>
  );
};
