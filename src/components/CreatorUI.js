import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import GenerateSection from './GenerateSection';
import StorySection from './StorySection';
import TranslateSection from './TranslateSection';
import ViewTranslationsSection from './ViewTranslationsSection';
import GenAIAPI from '../api/genaiapi';
import { LANGUAGES } from '../constants/languages';
import { ApiKeyCheck } from './CoreComponents';

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
            const { story: storyRes, title: titleRes } = await GenAIAPI.generateStoryAndTitle(prompt);
            setStory(storyRes);
            setTitle(titleRes);
        } catch (error) {
            console.error('Generation error:', error);
        }
        setLoading(prev => ({ ...prev, generate: false }));
    };

    const translateLanguage = async (langCode, story, title) => {
        const langConfig = LANGUAGES.find(lang => lang.code === langCode);

        const { translatedStory, translatedTitle } = await GenAIAPI.translateStoryAndTitle(
            story,
            title,
            langConfig.name
        );

        const sentences = await GenAIAPI.getSentences(translatedStory, langConfig.name);
        if (sentences.length > 200) {
            throw new Error('Maximum 200 sentences allowed');
        }

        const BATCH_SIZE = 5;
        const batches = [];
        for (let i = 0; i < sentences.length; i += BATCH_SIZE) {
            const batch = sentences.slice(i, i + BATCH_SIZE).map(sentence => sentence.original);
            batches.push(batch);
        }

        const batchPromises = batches.map(batch =>
            GenAIAPI.getWords(batch, langConfig.name, langConfig.translation_context)
        );

        const batchResults = await Promise.all(batchPromises);
        const words = batchResults.flat();

        return {
            langCode,
            data: {
                sentences,
                words,
                translatedTitle
            }
        };
    };

    const handleTranslate = async () => {
        setLoading(prev => ({ ...prev, translate: true }));
        setErrors({ sentences: null });
        setInProgressTranslations(selectedLangs);

        try {
            const translationPromises = selectedLangs.map(langCode =>
                translateLanguage(langCode, story, title)
                    .then(result => {
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
                    })
                    .catch(error => {
                        setInProgressTranslations(prev => prev.filter(lang => lang !== langCode));
                        console.error(`Translation error for ${langCode}:`, error);
                        return { langCode, error };
                    })
            );

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
        const zip = new JSZip();
        const folder = zip.folder(title.replace(/ /g, '_').toLowerCase());

        // Save English version
        folder.file("english.json", JSON.stringify({
            story: story,
            title: title
        }, null, 2));

        // Save translations
        for (const [lang, data] of Object.entries(translations)) {
            folder.file(`${lang}.json`, JSON.stringify({
                story: data.sentences.map(s => s.original).join(' '),
                title: data.translatedTitle,
                sentences: data.sentences,
                words: data.words
            }, null, 2));
        }

        const content = await zip.generateAsync({ type: "blob" });
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