import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ className = '' }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-medium ${className}`}
            title="Toggle Language / भाषा बदलें"
        >
            <Globe className="w-5 h-5" />
            <span>{i18n.language === 'en' ? 'हिंदी (HI)' : 'English (EN)'}</span>
        </button>
    );
};

export default LanguageSwitcher;
