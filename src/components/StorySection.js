// StorySection.jsx
import React from 'react';
import { Accordion, TextField } from './CoreComponents';
const StorySection = ({ isOpen, onToggle, title, setTitle, story, setStory }) => {
    return (
        <Accordion
            title="2. Enter a story"
            subtitle="Either generate it via step 1 or paste in your own"
            isOpen={isOpen}
            toggle={onToggle}
        >
            <div className="form-group">
                <label htmlFor="title">Story Title</label>
                <TextField
                    id="title"
                    value={title}
                    onChange={setTitle}
                    placeholder="e.g. The Cat That Lost Its Hat"
                />
            </div>

            <div className="form-group">
                <label htmlFor="story">Story Content</label>
                <TextField
                    id="story"
                    value={story}
                    onChange={setStory}
                    placeholder={`e.g. Once upon a time in a small town, there lived a curious cat named Whiskers...

Your story should be engaging and suitable for translation into multiple languages. Consider including:
- Clear characters and settings
- Simple, descriptive language
- Cultural elements that can be appreciated globally`}
                    multiline
                    rows={10}
                />
            </div>
        </Accordion>
    );
};

export default StorySection;