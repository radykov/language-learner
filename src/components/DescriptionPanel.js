import React from 'react';
import useIsMobile from '../utils/useIsMobile';
const DescriptionPanel = ({ selectedSentence, selectedWord }) => {
    const isMobile = useIsMobile();
    return (
        <div className="right-panel">
            {!isMobile ? (
                <>
                    <div className="translation-info-title">
                        <h2>Translation Information</h2>
                    </div>
                    <WordInfo selectedWord={selectedWord} />
                    <SentenceInfo selectedSentence={selectedSentence} />
                </>
            ) : (
                <div className="mobile-translation-info">
                    <p className="mobile-translation-word">Word: {selectedWord ? selectedWord.translation : "No word selected"}</p>
                    <p className="mobile-translation-sentence">Sentence: {selectedSentence ? selectedSentence.translation : "No sentence selected"}</p>
                </div>
            )}
        </div>
    );
};

const SentenceInfo = ({ selectedSentence }) => {
    return (
        <div className="sentence-translation">
            <h3>Sentence Translation</h3>
            {selectedSentence ? <p>{selectedSentence.translation}</p> : "No sentence selected"}
        </div>
    );
};

const WordInfo = ({ selectedWord }) => {
    return (
        <div className="word-info">
            <h3>Word Details</h3>
            {selectedWord ? (
                <>
                    <p><strong>Translation:</strong> {selectedWord.translation}</p>
                    <p><strong>Explanation:</strong> {selectedWord.explanation}</p>
                </>
            ) : "No word selected"}
        </div>
    );
};

export default DescriptionPanel;