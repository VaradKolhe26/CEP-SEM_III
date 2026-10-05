import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ScamReport } from '../../types';

export const ReportScamScreen: React.FC = () => {
  const { currentUser, submitScamReport } = useApp();
  const { t } = useTranslation();
  const [scamType, setScamType] = useState<'email' | 'text' | 'call' | 'website'>('text');
  const [title, setTitle] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the scam title and description.');
      return;
    }

    const reportData: Omit<ScamReport, 'id' | 'reqId' | 'dateSubmitted' | 'status'> = {
      reportedBy: currentUser.name,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      category:
        scamType === 'email'
          ? 'Email'
          : scamType === 'text'
          ? 'SMS'
          : scamType === 'call'
          ? 'Call'
          : 'Website',
      scamType,
      title: title.trim(),
      description: `${senderInfo ? `[Sender: ${senderInfo}] ` : ''}${description.trim()}`,
      priority,
      screenshotUrl: uploadedFileName
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbm6tCsN8sPA6LvVMq4piU3DAUGLVuNlQN5JJiTsTwEhBzuaKxRCaMT9PO1QO8tnENieE36hQ2cFYX8TkxoJimFjUJbjqgegTlXBTSaxg9mS4rM0rOMcEAz4HWCvrWfLRKxwNDqVIdp54ypWbZvN9HISHuZk_GDaZGwe9Nd3VY88MmGVKrFrGO0cjtWswie8WEG690CsQO6NuFT1-1NHGfBT0oJSbkNrqC1PNJeqwrWsc7ISfm5BSf8Q'
        : undefined,
    };

    submitScamReport(reportData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-2">
        <span className="px-3 py-1 bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold rounded-full uppercase tracking-wider">
          {t('communityDefense')}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
          {t('reportScamTitle')}
        </h1>
        <p className="text-sm text-[#45464d]">
          {t('reportScamSub')}
        </p>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-[#eceef0] shadow-sm space-y-6">
        {/* Scam Type Chips */}
        <div>
          <label className="block text-xs font-bold text-[#191c1e] mb-2 uppercase tracking-wider">
            {t('scamTypeQuestion')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'text', label: t('smsText'), icon: 'sms' },
              { id: 'email', label: t('emailPhishing'), icon: 'mail' },
              { id: 'call', label: t('fakeCall'), icon: 'call' },
              { id: 'website', label: t('fakeWebsite'), icon: 'language' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setScamType(type.id as any)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                  scamType === type.id
                    ? 'bg-[#86f2e4]/30 border-[#006a61] text-[#006f66] shadow-xs'
                    : 'bg-[#f7f9fb] border-[#c6c6cd] text-[#45464d] hover:border-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sender Info */}
        <div>
          <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
            {t('senderInfo')}
          </label>
          <input
            type="text"
            value={senderInfo}
            onChange={(e) => setSenderInfo(e.target.value)}
            placeholder="e.g. +1 (800) 555-0199 or support@hdfc-update.cc"
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
          />
        </div>

        {/* Summary Title */}
        <div>
          <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
            {t('shortSummary')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Received SMS claiming bank account blocked unless I click link"
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white"
            required
          />
        </div>

        {/* Details Textarea */}
        <div>
          <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
            {t('incidentDetails')}
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what the message said, what they asked you to do, and whether you clicked any links or shared info..."
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl text-sm font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006a61] focus:bg-white resize-none"
            required
          />
        </div>

        {/* Drag and Drop Screenshot Upload */}
        <div>
          <label className="block text-xs font-bold text-[#191c1e] mb-1.5 uppercase tracking-wider">
            {t('attachScreenshot')}
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDragging
                ? 'border-[#006a61] bg-[#86f2e4]/20'
                : 'border-[#c6c6cd] bg-[#f7f9fb] hover:bg-[#eceef0]'
            }`}
          >
            <input
              type="file"
              id="scam-screenshot"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadedFileName ? (
              <div className="flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[#006a61] text-[24px]">
                  image
                </span>
                <span className="text-xs font-bold text-[#191c1e]">{uploadedFileName}</span>
                <button
                  type="button"
                  onClick={() => setUploadedFileName(null)}
                  className="text-xs text-[#ba1a1a] hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label htmlFor="scam-screenshot" className="cursor-pointer block space-y-1">
                <span className="material-symbols-outlined text-[32px] text-[#76777d]">
                  cloud_upload
                </span>
                <p className="text-xs font-bold text-[#191c1e]">
                  Click to upload screenshot or drag & drop file here
                </p>
                <p className="text-[11px] text-[#76777d]">PNG, JPG up to 10MB</p>
              </label>
            )}
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-[#191c1e] mb-2 uppercase tracking-wider">
            {t('urgencyPriority')}
          </label>
          <div className="flex gap-3">
            {(['Low', 'Medium', 'High'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setPriority(lvl)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  priority === lvl
                    ? lvl === 'High'
                      ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]'
                      : 'bg-[#86f2e4]/40 text-[#006f66] border border-[#006a61]'
                    : 'bg-[#f7f9fb] text-[#76777d] border border-[#c6c6cd]'
                }`}
              >
                {lvl} {t('priority')}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full py-4 bg-[#006a61] text-white font-bold rounded-2xl hover:bg-[#005049] transition-all shadow-md active:scale-95 text-base flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[22px]">send</span>
          <span>{t('submitScamReport')}</span>
        </button>
      </form>
    </div>
  );
};
