import React, { useState } from 'react';

const TitleContainer = ({ currentStoryTitle, data, stories, setStoryPath }) => {
    const [isStoryDropdownOpen, setIsStoryDropdownOpen] = useState(false);

    return (
        <div className="title-container">
            <div
                className="title-selector"
                onClick={() => setIsStoryDropdownOpen(!isStoryDropdownOpen)}
            >
                <div className="title-content">
                    <div>
                        <h1>{currentStoryTitle}</h1>
                        {data?.title && (
                            <h2 className="translated-title">{data.title}</h2>
                        )}
                    </div>
                    <span className="view-more-text">
                        {isStoryDropdownOpen ? '▲' : '▼'}
                    </span>
                </div>
                {isStoryDropdownOpen && (
                    <div className="story-dropdown">
                        {stories.map((story) => (
                            <div
                                key={story.path}
                                className="story-option"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStoryPath(story.path);
                                    setIsStoryDropdownOpen(false);
                                }}
                            >
                                {story.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TitleContainer;
