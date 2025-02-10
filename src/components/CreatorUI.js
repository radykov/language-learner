import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import GenerateSection from './GenerateSection';
import StorySection from './StorySection';
import TranslateSection from './TranslateSection';
import ViewTranslationsSection from './ViewTranslationsSection';
import { LANGUAGES } from '../constants/languages';
import { ApiKeyCheck } from './CoreComponents';
import { translateLanguage, createZipFile, generateStory } from '../utils/storyGenerationUtils'

const CreatorUI = () => {
    const [prompt, setPrompt] = useState('');
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [selectedLangs, setSelectedLangs] = useState([]);
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState({ generate: false, translate: false });
    const [errors, setErrors] = useState({ sentences: null });
    const [openSections, setOpenSections] = useState({
        generate: true,
        story: true,
        translate: true,
        view: true
    });
    const [inProgressTranslations, setInProgressTranslations] = useState([]);

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    const handleGenerate = async () => {
        setLoading(prev => ({ ...prev, generate: true }));
        try {
            const { story: storyRes, title: titleRes } = await generateStory(prompt);
            setStory(storyRes);
            setTitle(titleRes);
        } catch (error) {
            console.error('Generation error:', error);
        }
        setLoading(prev => ({ ...prev, generate: false }));
    };

    const handleTranslate = async () => {
        setLoading(prev => ({ ...prev, translate: true }));
        setErrors({ sentences: null });
        setInProgressTranslations(selectedLangs);

        try {
            const translationPromises = selectedLangs.map(async langCode => {
                try {
                    const result = await translateLanguage(langCode, story, title);
                    setInProgressTranslations(prev => prev.filter(lang => lang !== langCode));
                    // Update translations immediately when each language completes
                    if (!result.error) {
                        setTranslations(prev => ({
                            ...prev,
                            [result.langCode]: result.data
                        }));
                    } else if (result.error.message === 'Maximum 200 sentences allowed') {
                        setErrors({ sentences: result.error.message });
                    }
                    return result;
                } catch (error) {
                    setInProgressTranslations(prev => prev.filter(lang => lang !== langCode));
                    console.error(`Translation error for ${langCode}:`, error);
                    return { langCode, error };
                }
            });

            await Promise.all(translationPromises);
        } catch (error) {
            console.error('Translation error:', error);
            setInProgressTranslations([]);
        } finally {
            setLoading(prev => ({ ...prev, translate: false }));
        }
    };

    const createZip = async () => {
        setLoading(prev => ({ ...prev, translate: true }));
        const content = await createZipFile(title, story, translations)
        saveAs(content, `${title.replace(/ /g, '_')}.zip`);
        setLoading(prev => ({ ...prev, translate: false }));
    };

    return (
        <div>
            <ApiKeyCheck />
            <div className="accordion-container">
                <GenerateSection
                    isOpen={openSections.generate}
                    onToggle={() => toggleSection('generate')}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    handleGenerate={handleGenerate}
                    isLoading={loading.generate}
                />

                <StorySection
                    isOpen={openSections.story}
                    onToggle={() => toggleSection('story')}
                    title={title}
                    setTitle={setTitle}
                    story={story}
                    setStory={setStory}
                />

                <TranslateSection
                    isOpen={openSections.translate}
                    onToggle={() => toggleSection('translate')}
                    selectedLangs={selectedLangs}
                    setSelectedLangs={setSelectedLangs}
                    handleTranslate={handleTranslate}
                    isLoading={loading.translate}
                    error={errors.sentences}
                    languages={LANGUAGES}
                    story={story}
                    title={title}
                />

                <ViewTranslationsSection
                    isOpen={openSections.view}
                    onToggle={() => toggleSection('view')}
                    translations={translations}
                    createZip={createZip}
                    title={title}
                    story={story}
                    inProgressTranslations={inProgressTranslations}
                />
            </div>
        </div>
    );
};

export default CreatorUI;