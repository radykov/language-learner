
import JSZip from 'jszip';
import GenAIAPI from '../api/genaiapi';
import { LANGUAGES } from '../constants/languages';

export async function generateStory(prompt) {
    return await GenAIAPI.generateStoryAndTitle(prompt);
}

export async function translateLanguage(langCode, story, title) {
    const langConfig = LANGUAGES.find(lang => lang.code === langCode);
    if (!langConfig) {
        throw new Error(`No language configuration found for code: ${langCode}`);
    }
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
}

export async function createZipFile(title, story, translations, outputPath = null) {
    const zip = new JSZip();
    const folderName = title.replace(/ /g, '_').toLowerCase();
    const folder = zip.folder(folderName);

    // Add the original (English) version
    folder.file("english.json", JSON.stringify({
        story: story,
        title: title
    }, null, 2));

    // Add each translation as its own file
    for (const [lang, data] of Object.entries(translations)) {
        folder.file(`${lang}.json`, JSON.stringify({
            story: data.sentences.map(s => s.original).join(' '),
            title: data.translatedTitle,
            sentences: data.sentences,
            words: data.words,
            error: data.error
        }, null, 2));
    }
    if (outputPath == null) {
        return await zip.generateAsync({ type: "blob" });
    }
    return await zip.generateAsync({ type: "nodebuffer" });
    // fs.writeFileSync(outputPath, content);
}