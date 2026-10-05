import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Language, LanguageOption } from '../../types';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'pills' | 'floating' | 'compact';
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = '',
  showLabel = true,
}) => {
  const { language, setLanguage, languageOptions, currentLanguageOption, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // --- 1. PILLS VARIANT ---
  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center bg-[#eceef0] p-1 rounded-2xl border border-[#c6c6cd] shadow-xs ${className}`}>
        {languageOptions.map((opt) => {
          const isActive = opt.code === language;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => handleSelect(opt.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                isActive
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'text-[#45464d] hover:text-[#191c1e] hover:bg-white/60'
              }`}
              title={`Switch language to ${opt.label}`}
              aria-pressed={isActive}
            >
              <span>{opt.flag}</span>
              <span>{opt.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // --- 2. COMPACT VARIANT ---
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-xl border border-[#c6c6cd] text-xs font-bold ${className}`}>
        {languageOptions.map((opt, idx) => (
          <React.Fragment key={opt.code}>
            <button
              type="button"
              onClick={() => handleSelect(opt.code)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                opt.code === language
                  ? 'bg-[#86f2e4] text-[#006f66] font-black'
                  : 'text-[#76777d] hover:text-[#191c1e]'
              }`}
            >
              {opt.code.toUpperCase()}
            </button>
            {idx < languageOptions.length - 1 && <span className="text-[#c6c6cd]">|</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // --- 3. FLOATING QUICK ACCESS BUTTON (Fixed Bottom-Right) ---
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 ${className}`} ref={dropdownRef}>
        {isOpen && (
          <div className="absolute bottom-14 right-0 w-60 bg-white rounded-2xl shadow-2xl border border-[#c6c6cd] p-2 mb-2 animate-in fade-in slide-in-from-bottom-3 z-50">
            <div className="px-3 py-2 border-b border-[#eceef0] flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#191c1e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006a61]">translate</span>
                <span>{t('selectLanguage')}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#76777d] hover:text-[#191c1e] p-0.5 rounded-md"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="py-1 space-y-1">
              {languageOptions.map((opt) => {
                const isActive = opt.code === language;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => handleSelect(opt.code)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#86f2e4]/40 text-[#006f66] font-bold border border-[#86f2e4]'
                        : 'text-[#191c1e] hover:bg-[#eceef0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{opt.flag}</span>
                      <span>{opt.nativeLabel}</span>
                      <span className="text-[10px] text-[#76777d]">({opt.label})</span>
                    </div>
                    {isActive && (
                      <span className="material-symbols-outlined text-[18px] text-[#006a61]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#131b2e] hover:bg-[#006a61] text-white px-3.5 py-2 md:px-4 md:py-2.5 rounded-full shadow-2xl border-2 border-white/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#86f2e4] group"
          title={t('changeLanguage')}
          aria-label={t('changeLanguage')}
          aria-expanded={isOpen}
        >
          <span className="text-base">{currentLanguageOption.flag}</span>
          <span className="text-xs font-bold tracking-tight">
            {currentLanguageOption.nativeLabel}
          </span>
          <span className="material-symbols-outlined text-[18px] text-[#86f2e4] group-hover:rotate-180 transition-transform">
            translate
          </span>
        </button>
      </div>
    );
  }

  // --- 4. DROPDOWN VARIANT (Default for TopAppBar & Screen Headers) ---
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 md:py-2 bg-white/90 hover:bg-[#eceef0] border border-[#c6c6cd] rounded-full text-xs font-bold text-[#191c1e] transition-all shadow-2xs hover:shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#006a61]"
        aria-label={t('changeLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="material-symbols-outlined text-[18px] text-[#006a61]">language</span>
        <span className="text-sm">{currentLanguageOption.flag}</span>
        {showLabel && (
          <span className="tracking-tight text-xs font-extrabold">{currentLanguageOption.nativeLabel}</span>
        )}
        <span className="material-symbols-outlined text-[16px] text-[#76777d] transition-transform duration-200">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#c6c6cd] py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3.5 py-1.5 border-b border-[#eceef0]">
            <p className="text-[11px] font-extrabold text-[#76777d] uppercase tracking-wider">
              {t('selectLanguage')}
            </p>
          </div>
          <div className="py-1 px-1.5 space-y-1">
            {languageOptions.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#86f2e4]/30 text-[#006f66] font-extrabold border border-[#86f2e4]'
                      : 'text-[#191c1e] hover:bg-[#eceef0] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{opt.flag}</span>
                    <div>
                      <p className="font-bold">{opt.nativeLabel}</p>
                      <p className="text-[10px] text-[#76777d]">{opt.label}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-[#006a61]">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
