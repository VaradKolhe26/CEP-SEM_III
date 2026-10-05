import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { motion } from 'motion/react';

export const SignUpScreen: React.FC = () => {
  const { signup, setCurrentScreen } = useApp();
  const { t } = useTranslation();
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('errEnterName'));
      return;
    }
    if (!phone.trim()) {
      setError(t('errEnterPhone'));
      return;
    }
    if (pin.length < 4) {
      setError(t('errEnterPin'));
      return;
    }
    if (pin !== confirmPin) {
      setError(t('errPinMismatch'));
      return;
    }
    if (!agreeTerms) {
      setError(t('errAcceptTerms'));
      return;
    }
    setError('');
    signup(name, phone, pin, role);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-center items-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#eceef0] shadow-xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">{t('createFreeAccount')}</h1>
          <p className="text-xs text-[#76777d]">{t('taglineSub')}</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-[#eceef0] p-1 rounded-2xl mb-6 border border-[#c6c6cd]">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'user'
                ? 'bg-white text-[#006a61] shadow-xs'
                : 'text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            {t('citizenAccount')}
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'admin'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            {t('systemAdministrator')}
          </button>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#191c1e] mb-1 uppercase tracking-wider">
              {t('fullName')}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-[#76777d]">
                person
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-11 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191c1e] mb-1 uppercase tracking-wider">
              {t('phoneNumber')}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-[#76777d]">
                phone
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
                className="w-full pl-11 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#191c1e] mb-1 uppercase tracking-wider">
                {t('createPin')}
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] text-center focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white tracking-widest"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191c1e] mb-1 uppercase tracking-wider">
                {t('confirmPin')}
              </label>
              <input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] text-center focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#006a61] focus:ring-[#006a61]"
            />
            <label htmlFor="terms" className="text-xs text-[#45464d] leading-relaxed">
              {t('agreeTerms')}
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#006a61] text-white font-bold rounded-xl hover:bg-[#005049] transition-all shadow-md active:scale-95 text-base flex items-center justify-center gap-2 mt-4"
          >
            <span>{t('createSafeAccount')}</span>
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
          </button>
        </form>

        {/* Existing account link */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#45464d]">
            {t('alreadyHaveAccount')}{' '}
            <button
              onClick={() => setCurrentScreen('login')}
              className="font-bold text-[#006a61] hover:underline"
            >
              {t('logInHere')}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
