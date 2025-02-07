// ViewTranslationsSection.jsx
import React from 'react';
import { Accordion, Button } from './CoreComponents';

const ViewTranslationsSection = ({
    isOpen,
    onToggle,
    translations,
    createZip,
    title,
    story,
    inProgressTranslations = [] // New prop for tracking translations being generated
}) => {
    const getFileList = () => {
        const files = [];
        // Only add english.json if there's content
        if (title?.trim() && story?.trim()) {
            files.push('english.json');
        }
        // Add completed translations
        Object.keys(translations).forEach(lang => {
            files.push(`${lang}.json`);
        });
        return files;
    };

    const files = getFileList();
    const hasTranslations = Object.keys(translations).length > 0 || (title?.trim() && story?.trim());
    const inProgressFiles = inProgressTranslations
        .filter(lang => !translations[lang])
        .map(lang => `${lang}.json`);

    return (
        <Accordion
            title="4. Download files"
            subtitle="Download the translations of the files"
            isOpen={isOpen}
            toggle={onToggle}
        >
            <div className="translations-preview">
                {files.length > 0 && (
                    <div className="installation-instructions">
                        <h3>Installation Instructions:</h3>
                        <p>After downloading, follow these steps:</p>
                        <ol>
                            <li>Unzip the downloaded file</li>
                            <li>Copy the folder to <code>/public/stories</code></li>
                            <li>Modify <code>/public/stories/stories.json</code> by adding a new entry to the stories array:
                                <pre className="code-snippet">
                                    {`{
    "title": "${title}",
    "path": "${title.replace(/ /g, '_').toLowerCase()}"
}`}
                                </pre>
                            </li>
                        </ol>
                    </div>
                )}
                {files.length > 0 && (
                    <>
                        <h3>Files ready for download:</h3>
                        <div className="file-list">
                            {files.map(file => (
                                <div key={file} className="file-item">
                                    <span className="file-icon">📄</span>
                                    {file}
                                </div>
                            ))}
                        </div>
                        {hasTranslations && (
                            <Button
                                onClick={createZip}
                                variant="primary"
                            >
                                Download Translations
                            </Button>
                        )}
                    </>
                )}
                
                {inProgressFiles.length > 0 && (
                    <>
                        <h3>Files being generated:</h3>
                        <div className="file-list">
                            {inProgressFiles.map(file => (
                                <div key={file} className="file-item in-progress">
                                    <span className="file-icon">⏳</span>
                                    {file}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {files.length === 0 && inProgressFiles.length === 0 && (
                    <div className="no-files-message">
                        You need to generate translations or at least have the english title and story first
                    </div>
                )}
            </div>
        </Accordion>
    );
};

export default ViewTranslationsSection;