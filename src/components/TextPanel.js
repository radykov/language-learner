import React from 'react';
import { deepseekClient } from '../api/genaiapi.js';

const TextPanel = ({ data, setSelectedSentence, setSelectedWord }) => {
    return (
        <div className="left-panel">
            <div className="text-content-title">
                <h2>Story</h2>
            </div>
            <div className="text-content">
                {data.words.map((sentenceWords, i) => (
                    <div
                        key={i}
                        className="sentence"
                        onMouseEnter={() => setSelectedSentence(data.sentences[i])}
                        onMouseLeave={() => setSelectedSentence(null)}
                    >
                        {sentenceWords.map((word, j) => (
                            <span
                                key={`${i}-${j}`}
                                className="word"
                                onMouseEnter={() => setSelectedWord(word)}
                                onMouseLeave={() => setSelectedWord(null)}
                            >
                                {word.word}{' '}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TextPanel;