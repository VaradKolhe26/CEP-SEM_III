import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion } from 'motion/react';

export const HowToUseScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { t } = useTranslation();

  const steps = [
    {
      num: 1,
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: 'touch_app',
    },
    {
      num: 2,
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: 'visibility',
    },
    {
      num: 3,
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: 'security',
    },
    {
      num: 4,
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: 'forum',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-sm font-bold text-[#006a61] hover:underline"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>{t('backToHome')}</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-[#76777d]">
            {t('howToUse')}
          </span>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#eceef0] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#86f2e4]/30 rounded-full text-xs font-bold text-[#006f66]">
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span>Learning Path</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] tracking-tight">
              How to Use SafeGuard Digital
            </h1>
            <p className="text-sm md:text-base text-[#45464d] leading-relaxed">
              Designed specifically for everyday phone and internet users. No tech background required!
              Follow these simple steps to build bulletproof cyber awareness.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('signup')}
                className="px-6 py-3 bg-[#006a61] text-white font-bold rounded-full hover:bg-[#005049] transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Start Learning Now</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#eceef0] bg-[#f2f4f6]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbm6tCsN8sPA6LvVMq4piU3DAUGLVuNlQN5JJiTsTwEhBzuaKxRCaMT9PO1QO8tnENieE36hQ2cFYX8TkxoJimFjUJbjqgegTlXBTSaxg9mS4rM0rOMcEAz4HWCvrWfLRKxwNDqVIdp54ypWbZvN9HISHuZk_GDaZGwe9Nd3VY88MmGVKrFrGO0cjtWswie8WEG690CsQO6NuFT1-1NHGfBT0oJSbkNrqC1PNJeqwrWsc7ISfm5BSf8Q"
              alt="How to use guide preview"
              className="w-full h-auto object-cover max-h-[300px]"
            />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-3xl border border-[#eceef0] shadow-xs flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center font-black text-lg">
                  {s.num}
                </div>
                <span className="material-symbols-outlined text-[26px] text-[#76777d]">
                  {s.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#191c1e]">{s.title}</h3>
              <p className="text-sm text-[#45464d] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Safety Principles Section */}
        <div className="bg-[#131b2e] text-white rounded-3xl p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#86f2e4] text-[32px]">verified</span>
            <h2 className="text-2xl font-bold">The 3 Golden Rules of Digital Safety</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h4 className="font-bold text-[#86f2e4] text-base mb-1">1. Stop & Breathe</h4>
              <p className="text-xs text-gray-300">
                Scammers rely on urgency ("Act in 10 minutes or lose money"). Take 5 minutes to verify before acting.
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h4 className="font-bold text-[#86f2e4] text-base mb-1">2. PIN is for Sending</h4>
              <p className="text-xs text-gray-300">
                You never type your UPI PIN or debit card PIN to receive cashback or payments.
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <h4 className="font-bold text-[#86f2e4] text-base mb-1">3. Keep OTP Secret</h4>
              <p className="text-xs text-gray-300">
                No bank manager, customer support, or official will ever ask you to read your OTP.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-6">
          <button
            onClick={() => setCurrentScreen('signup')}
            className="px-8 py-4 bg-[#006a61] text-white font-bold text-base rounded-full hover:bg-[#005049] transition-all shadow-lg active:scale-95"
          >
            Ready to Begin? Create Your Free Account
          </button>
        </div>
      </div>
    </div>
  );
};
