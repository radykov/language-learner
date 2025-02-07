// TranslateSection.jsx
import React from 'react';
import { Accordion, Button } from './CoreComponents';

const TranslateSection = ({
    isOpen,
    onToggle,
    selectedLangs,
    setSelectedLangs,
    handleTranslate,
    isLoading,
    error,
    languages,
    story,
    title
}) => {
    const isValidContent = story && title && story.trim() !== '' && title.trim() !== '';
    const isButtonDisabled = isLoading || !selectedLangs.length || !isValidContent;

    return (
        <Accordion
            title="3. Generate translations"
            subtitle="Choose the languages you want for the translations"
            isOpen={isOpen}
            toggle={onToggle}
        >
            <div className="language-selector">
                {languages.map(lang => (
                    <label key={lang.code}>
                        <input
                            type="checkbox"
                            checked={selectedLangs.includes(lang.code)}
                            onChange={(e) => setSelectedLangs(
                                e.target.checked
                                    ? [...selectedLangs, lang.code]
                                    : selectedLangs.filter(l => l !== lang.code)
                            )}
                        />
                        {lang.emoji} {lang.name}
                    </label>
                ))}
            </div>

            {error && <div className="error-text">{error}</div>}

            <Button
                onClick={handleTranslate}
                disabled={isButtonDisabled}
                variant="primary"
            >
                {isLoading ? 'Translating...' : 'Translate'}
            </Button>
        </Accordion>
    );
};

export default TranslateSection;