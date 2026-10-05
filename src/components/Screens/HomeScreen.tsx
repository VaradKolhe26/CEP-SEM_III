import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion } from 'motion/react';
import LP from '../../assets/LP.png';

export const HomeScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-6"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#86f2e4]/30 border border-[#86f2e4] text-[#006f66] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{t('freeAndBeginner')}</span>
            </div>

            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#000000] tracking-tight leading-[1.15]">
              {t('heroTitlePart1')} <br />
              <span className="text-[#006a61]">{t('heroTitlePart2')}</span>
            </h1>

            <p className="text-lg md:text-xl text-[#45464d] leading-relaxed max-w-xl">
              {t('heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={() => setCurrentScreen('signup')}
                className="px-8 py-4 bg-[#006a61] text-white font-bold text-base md:text-lg rounded-full hover:bg-[#005049] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t('signUpForFree')}</span>
                <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
              </button>

              <button
                onClick={() => setCurrentScreen('how_to_use')}
                className="px-8 py-4 border-2 border-[#000000] text-[#000000] font-bold text-base md:text-lg rounded-full hover:bg-[#eceef0] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[22px]">play_circle</span>
                <span>{t('howToUse')}</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#e6e8ea] w-full max-w-lg">
              <div>
                <p className="font-black text-2xl text-[#006a61]">5+</p>
                <p className="text-xs text-[#76777d]">{t('metricInteractiveModules')}</p>
              </div>
              <div>
                <p className="font-black text-2xl text-[#006a61]">100%</p>
                <p className="text-xs text-[#76777d]">{t('metricPracticalSimulations')}</p>
              </div>
              <div>
                <p className="font-black text-2xl text-[#006a61]">24/7</p>
                <p className="text-xs text-[#76777d]">{t('metricAiSupport')}</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Illustration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-[#86f2e4]/20 via-[#ffffff] to-[#ffdcc3]/20 p-2 sm:p-4">
              <img
                src={LP}
                alt="Safe Digital Living Family Protection Illustration"
                className="w-full h-auto max-h-[460px] object-cover rounded-2xl"
              />

              {/* Floating Shield Badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-[#eceef0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </div>
                <div>
                  <p className="text-xs text-[#76777d] font-medium">{t('appName')}</p>
                  <p className="text-sm font-extrabold text-[#191c1e]">{t('digitalSafetyActive')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#000000] tracking-tight">
              {t('homeFeaturesTitle')}
            </h2>
            <p className="text-[#45464d] text-base mt-2">
              {t('homeFeaturesSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#eceef0] shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">menu_book</span>
              </div>
              <h3 className="font-bold text-xl text-[#191c1e]">{t('feat1Title')}</h3>
              <p className="text-sm text-[#45464d] leading-relaxed">
                {t('feat1Desc')}
              </p>
              <button
                onClick={() => setCurrentScreen('signup')}
                className="mt-auto text-[#006a61] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                <span>{t('exploreModules')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#eceef0] shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ffdcc3]/40 text-[#c76c00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">quiz</span>
              </div>
              <h3 className="font-bold text-xl text-[#191c1e]">{t('feat2Title')}</h3>
              <p className="text-sm text-[#45464d] leading-relaxed">
                {t('feat2Desc')}
              </p>
              <button
                onClick={() => setCurrentScreen('fraud_simulator')}
                className="mt-auto text-[#006a61] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                <span>{t('trySimulator')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#eceef0] shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#eceef0] text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">forum</span>
              </div>
              <h3 className="font-bold text-xl text-[#191c1e]">{t('feat3Title')}</h3>
              <p className="text-sm text-[#45464d] leading-relaxed">
                {t('feat3Desc')}
              </p>
              <button
                onClick={() => setCurrentScreen('personal_guide')}
                className="mt-auto text-[#006a61] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                <span>{t('talkToGuide')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pre-Footer Call-To-Action Banner with Sign Up */}
        <section className="mt-20 bg-gradient-to-r from-[#006a61] to-[#004d46] text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t('readyToBegin')}
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-xl">
              {t('homeFeaturesSub')}
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('signup')}
            className="px-8 py-4 bg-white text-[#006a61] font-extrabold text-base rounded-full hover:bg-[#86f2e4] transition-all shadow-lg active:scale-95 whitespace-nowrap flex items-center gap-2 shrink-0"
          >
            <span>{t('signUp')}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#eceef0] bg-white py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#76777d]">
          <p>{t('footerCopyright')}</p>
          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => setCurrentScreen('how_to_use')} className="hover:text-[#191c1e]">
              {t('howItWorks')}
            </button>
            <button onClick={() => setCurrentScreen('privacy_settings')} className="hover:text-[#191c1e]">
              {t('privacyAndSecurity')}
            </button>
            <button onClick={() => setCurrentScreen('report_scam')} className="hover:text-[#191c1e]">
              {t('reportFraud')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
