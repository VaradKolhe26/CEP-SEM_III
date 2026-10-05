import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { login, setCurrentScreen } = useApp();
  const { t } = useTranslation();
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [phone, setPhone] = useState('555-0123');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError(t('errEnterPhone'));
      return;
    }
    if (pin.length < 4) {
      setError(t('errEnterPin'));
      return;
    }
    setError('');
    login(phone, pin, role);
  };

  const setDemoCredentials = (demoRole: 'user' | 'admin') => {
    setRole(demoRole);
    if (demoRole === 'admin') {
      setPhone('555-9999');
      setPin('9999');
    } else {
      setPhone('555-0123');
      setPin('1234');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-center items-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#eceef0] shadow-xl relative"
      >
        {/* Top Logo */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">{t('appName')}</h1>
          <p className="text-xs text-[#76777d]">{t('taglineSub')}</p>
        </div>

        {/* Role Segmented Switcher */}
        <div className="flex bg-[#eceef0] p-1 rounded-2xl mb-6 border border-[#c6c6cd]">
          <button
            type="button"
            onClick={() => setDemoCredentials('user')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'user'
                ? 'bg-white text-[#006a61] shadow-xs'
                : 'text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            {t('userLogin')}
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'admin'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            {t('adminPortal')}
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
              {t('phoneNumberOrId')}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-[#76777d]">
                phone
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 555-0123"
                className="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                {t('securityPin')}
              </label>
              <button
                type="button"
                onClick={() => alert('For this demo, your PIN is: ' + (role === 'admin' ? '9999' : '1234'))}
                className="text-xs text-[#006a61] hover:underline font-bold"
              >
                {t('forgotPin')}
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-[#76777d]">
                lock
              </span>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white tracking-widest"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#006a61] text-white font-bold rounded-xl hover:bg-[#005049] transition-all shadow-md active:scale-95 text-base flex items-center justify-center gap-2 mt-4"
          >
            <span>{t('logInSafely')}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {/* Demo Quick Fill Switchers */}
        <div className="mt-6 pt-4 border-t border-[#eceef0] flex items-center justify-between text-xs">
          <span className="text-[#76777d]">{t('quickDemoFill')}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setDemoCredentials('user')}
              className="px-2.5 py-1 bg-[#86f2e4]/40 text-[#006f66] font-bold rounded-lg hover:bg-[#86f2e4]"
            >
              {t('userDemo')}
            </button>
            <button
              onClick={() => setDemoCredentials('admin')}
              className="px-2.5 py-1 bg-[#131b2e] text-white font-bold rounded-lg hover:bg-black"
            >
              {t('adminDemo')}
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#45464d]">
            {t('dontHaveAccount')}{' '}
            <button
              onClick={() => setCurrentScreen('signup')}
              className="font-bold text-[#006a61] hover:underline"
            >
              {t('signUpForFree')}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
