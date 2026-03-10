import React, { useState, useEffect } from 'react';
import { X, Languages } from 'lucide-react';
import { guideContent } from '../constants/guideContent';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const GuideModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  
  // Initialize state based on current global language, defaulting to 'hi' if not 'en'
  const [lang, setLangState] = useState(i18n.language?.startsWith('en') ? 'en' : 'hi'); 

  // Sync state if global language changes externally
  useEffect(() => {
    setLangState(i18n.language?.startsWith('en') ? 'en' : 'hi');
  }, [i18n.language]);

  const setLang = (newLang) => {
    setLangState(newLang);
    i18n.changeLanguage(newLang); // Update global app language as well
  };

  if (!isOpen) return null;

  const content = guideContent[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-gray-500 mt-1">{content.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setLang('en')}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  lang === 'en' ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  lang === 'hi' ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                हिंदी
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white">
          {content.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50/30 hover:border-emerald-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {section.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto text-center"
          >
            {content.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
