import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion } from 'motion/react';

export const MyProgressScreen: React.FC = () => {
  const { currentUser, modules, earnedBadges, openLesson, setCurrentScreen } = useApp();
  const { t } = useTranslation();

  const nextModule = modules.find((m) => !m.isCompleted) || modules[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-[#86f2e4]/30 text-[#006f66] text-xs font-bold rounded-full uppercase tracking-wider">
            {t('safetyMasteryProfile')}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            {t('learningProgressBadges')}
          </h1>
          <p className="text-sm text-[#45464d]">
            {t('learningProgressSub')}
          </p>
        </div>

        <button
          onClick={() => openLesson(nextModule)}
          className="px-6 py-3 bg-[#006a61] text-white font-bold text-sm rounded-full hover:bg-[#005049] transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <span>{t('continueNextLesson')}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Overview Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#86f2e4]/40 text-[#006f66] flex items-center justify-center font-black text-xl">
            {currentUser.securityScore}%
          </div>
          <div>
            <p className="text-xs font-bold text-[#76777d] uppercase">{t('overallDefense')}</p>
            <h3 className="text-lg font-extrabold text-[#191c1e]">
              {currentUser.securityScore >= 80 ? t('wellProtected') : t('activeLearner')}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ffdcc3]/40 text-[#c76c00] flex items-center justify-center font-black text-xl">
            {currentUser.completedModules}/{currentUser.totalModules}
          </div>
          <div>
            <p className="text-xs font-bold text-[#76777d] uppercase">{t('modulesPassed')}</p>
            <h3 className="text-lg font-extrabold text-[#191c1e]">{currentUser.level}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eceef0] shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#eceef0] text-[#006a61] flex items-center justify-center font-black text-xl">
            <span className="material-symbols-outlined text-[30px]">military_tech</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#76777d] uppercase">{t('badgesEarned')}</p>
            <h3 className="text-lg font-extrabold text-[#191c1e]">
              {earnedBadges.filter((b) => b.unlocked).length} of {earnedBadges.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Badges Shelf */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
              {t('safetyBadges')}
            </h2>
            <p className="text-xs text-[#45464d]">{t('unlockBadgesSub')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col items-center text-center gap-3 ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-[#86f2e4]/20 to-white border-[#86f2e4] shadow-xs'
                  : 'bg-[#f7f9fb] border-[#eceef0] opacity-50'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${
                  badge.unlocked ? 'bg-[#006a61] text-white' : 'bg-[#c6c6cd] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[28px]">{badge.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">{badge.name}</h4>
                <p className="text-xs text-[#45464d] mt-1 leading-tight">{badge.description}</p>
              </div>
              <span
                className={`mt-auto text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  badge.unlocked ? 'bg-[#86f2e4] text-[#006f66]' : 'bg-[#eceef0] text-[#76777d]'
                }`}
              >
                {badge.unlocked ? t('unlocked') : t('locked')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Module Quiz Scoreboard */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">{t('moduleBreakdown')}</h2>

        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#eceef0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#006a61]">{t('module')} {mod.number}</span>
                  <span className="text-xs text-[#76777d]">• {mod.category}</span>
                </div>
                <h4 className="font-bold text-base text-[#191c1e]">{mod.title}</h4>
                <p className="text-xs text-[#45464d]">{mod.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {mod.quizScore ? (
                  <div className="text-right">
                    <span className="text-xs text-[#76777d]">{t('quizScore')}</span>
                    <p className="font-extrabold text-sm text-[#006a61]">{mod.quizScore}%</p>
                  </div>
                ) : (
                  <span className="text-xs text-[#76777d]">{t('notAttempted')}</span>
                )}

                <button
                  onClick={() => openLesson(mod)}
                  className="px-4 py-2 bg-white border border-[#c6c6cd] hover:border-[#006a61] text-[#191c1e] font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  {mod.isCompleted ? t('review') : t('start')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
