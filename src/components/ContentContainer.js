import React from 'react';
import TextPanel from './TextPanel';
import DescriptionPanel from './DescriptionPanel';

const ContentContainer = ({ data, setSelectedSentence, setSelectedWord, selectedSentence, selectedWord }) => {
    return (
        <div className="content-container">
            <TextPanel
                data={data}
                setSelectedSentence={setSelectedSentence}
                setSelectedWord={setSelectedWord}
            />
            <DescriptionPanel
                selectedSentence={selectedSentence}
                selectedWord={selectedWord}
            />
        </div>
    );
};

export default ContentContainer;