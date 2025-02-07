// GenerateSection.jsx
import React from 'react';
import { Accordion, TextField, Button } from './CoreComponents';

const GenerateSection = ({ isOpen, onToggle, prompt, setPrompt, handleGenerate, isLoading }) => {
    return (
        <Accordion
            title="1. Generate a story (optional)"
            subtitle="Enter a prompt to create a story"
            isOpen={isOpen}
            toggle={onToggle}
        >
            <TextField
                value={prompt}
                onChange={setPrompt}
                placeholder="Enter prompt, e.g. 'A cat that lost its hat'"
                multiline
            />
            <Button
                onClick={handleGenerate}
                disabled={isLoading}
                variant="primary"
            >
                {isLoading ? 'Generating...' : 'Generate'}
            </Button>
        </Accordion>
    );
};

export default GenerateSection;