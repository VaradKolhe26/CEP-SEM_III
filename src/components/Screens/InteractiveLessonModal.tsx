import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { LearningModule } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export const InteractiveLessonModal: React.FC = () => {
  const { activeLessonModule, closeLesson, completeModuleLesson, showToast } = useApp();
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!activeLessonModule) return null;

  const currentStep = activeLessonModule.steps[currentStepIndex] || activeLessonModule.steps[0];
  const isLastStep = currentStepIndex === activeLessonModule.steps.length - 1;

  const handleQuizSelect = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedQuizOption === null) {
      showToast('Please pick an answer option first', 'warning');
      return;
    }
    setQuizSubmitted(true);
  };

  const handleNextStep = () => {
    if (currentStep?.quiz && !quizSubmitted) {
      handleCheckAnswer();
      return;
    }

    if (isLastStep) {
      completeModuleLesson(activeLessonModule.id, currentStepIndex, 100);
      closeLesson();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#c6c6cd] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eceef0] flex items-center justify-between bg-[#f7f9fb]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#86f2e4] text-[#006f66] flex items-center justify-center font-bold text-sm">
              M{activeLessonModule.number}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c1e]">{activeLessonModule.title}</h3>
              <p className="text-xs text-[#76777d]">
                Step {currentStepIndex + 1} of {activeLessonModule.steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={closeLesson}
            className="p-1.5 text-[#76777d] hover:text-[#191c1e] hover:bg-[#eceef0] rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#eceef0] h-1.5">
          <div
            className="bg-[#006a61] h-1.5 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / activeLessonModule.steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Modal Body Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <span className="text-xs font-bold text-[#006a61] uppercase tracking-wider">
              {currentStep.subtitle || 'Lesson Concept'}
            </span>
            <h2 className="text-2xl font-extrabold text-[#191c1e] mt-1">{currentStep.title}</h2>
          </div>

          <p className="text-base text-[#45464d] leading-relaxed">{currentStep.content}</p>

          {/* Practical Tip Box */}
          {currentStep.tip && (
            <div className="p-4 rounded-2xl bg-[#86f2e4]/20 border border-[#86f2e4] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#006f66] text-[22px] mt-0.5">
                lightbulb
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#006f66]">{t('practicalSafetyTip')}</h4>
                <p className="text-xs text-[#191c1e] mt-0.5 leading-relaxed">{currentStep.tip}</p>
              </div>
            </div>
          )}

          {/* Warning Box */}
          {currentStep.warning && (
            <div className="p-4 rounded-2xl bg-[#ffdad6] border border-[#ffb4ab] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] mt-0.5">
                warning
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#ba1a1a]">{t('crucialRule')}</h4>
                <p className="text-xs text-[#93000a] mt-0.5 leading-relaxed">{currentStep.warning}</p>
              </div>
            </div>
          )}

          {/* Interactive Quiz if step has one */}
          {currentStep.quiz && (
            <div className="bg-[#f7f9fb] p-5 rounded-2xl border border-[#c6c6cd] space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c76c00] text-[20px]">
                  psychology
                </span>
                <h4 className="font-bold text-sm text-[#191c1e]">{t('knowledgeCheck')}</h4>
              </div>
              <p className="text-sm font-semibold text-[#191c1e]">{currentStep.quiz.question}</p>

              <div className="space-y-2">
                {currentStep.quiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === currentStep.quiz?.correctIndex;
                  let btnStyle = 'bg-white border-[#c6c6cd] text-[#191c1e] hover:border-[#006a61]';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-[#86f2e4]/40 border-[#006a61] text-[#006f66] font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#86f2e4]/30 border-[#006a61] text-[#006f66] font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuizSelect(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && (
                        <span className="material-symbols-outlined text-[#006a61] text-[18px]">
                          check_circle
                        </span>
                      )}
                      {quizSubmitted && isSelected && !isCorrect && (
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                          cancel
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    selectedQuizOption === currentStep.quiz.correctIndex
                      ? 'bg-[#86f2e4]/30 text-[#006f66] border border-[#86f2e4]'
                      : 'bg-[#ffdcc3] text-[#c76c00] border border-[#ffb77d]'
                  }`}
                >
                  <p className="font-bold mb-1">
                    {selectedQuizOption === currentStep.quiz.correctIndex
                      ? '🎉 Correct!'
                      : '💡 Explanation:'}
                  </p>
                  <p>{currentStep.quiz.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#eceef0] bg-[#f7f9fb] flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-xs font-bold text-[#76777d] hover:text-[#191c1e] disabled:opacity-30 disabled:pointer-events-none"
          >
            {t('previousStep')}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#006a61] text-white text-xs md:text-sm font-bold rounded-xl hover:bg-[#005049] transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span>{isLastStep ? t('completeModuleClaimBadge') : t('nextStep')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
