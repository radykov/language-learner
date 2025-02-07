import React from 'react';
import { LANGUAGES } from '../constants/languages';
import useIsMobile from '../utils/useIsMobile';

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, languages = LANGUAGES }) => {
    const isMobile = useIsMobile();
    return (
        <div className="language-selector">
            <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-dropdown"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.emoji}
                        {isMobile ? (
                            null
                        ) : (
                            <span className="language-name">{' ' + lang.name}</span>
                        )}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;