import { NO_TRANSLATION_CONTEXT } from '../constants/languages';

import { OpenAI } from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Singleton instance of the OpenAI API client
let openaiInstance = null;

// Initialize the OpenAI API client only when needed
const getOpenAIClient = () => {
    if (openaiInstance) {
        return openaiInstance;
    }

    if (!process.env.REACT_APP_GEN_AI_API_KEY?.trim()) {
        throw new Error('OpenAI API key is not configured. Please check your .env file.');
    }

    openaiInstance = new OpenAI({
        dangerouslyAllowBrowser: process.env.REACT_APP_NODE_ENV === 'development',
        apiKey: process.env.REACT_APP_GEN_AI_API_KEY
    });

    return openaiInstance;
};

class GenAIAPI {

    static async generateStoryAndTitle(prompt) {
        try {
            console.log('Generating story...');
            const openai = getOpenAIClient();
            const storyResponse = await openai.beta.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an assistant that writes detailed stories based on creative prompts.' },
                    { role: 'user', content: `Write a story of less than 100 lines based on the prompt and well as a title: ${prompt}` },
                ],
                response_format: zodResponseFormat(TitleAndStory, 'title_and_story'),
            });
            const storyAndTitle = storyResponse.choices[0].message.parsed;
            return storyAndTitle;
        } catch (error) {
            console.error('Error generating story and title:', error);
            throw error;
        }
    }

    static async generateTitle(prompt) {
        try {
            console.log('Generating title...');
            const openai = getOpenAIClient();
            const titleResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an assistant that generates creative stories and titles.' },
                    { role: 'user', content: `Generate a title for a story based on the following prompt: ${prompt}` },
                ],
            });
            const title = titleResponse.choices[0].message.content.trim();
            console.log('Title generated:', title);
            return title;
        } catch (error) {
            console.error('Error generating title:', error);
            throw error;
        }
    }

    static async translateStory(story, language) {
        try {
            console.log('Translating story into ', language);
            const openai = getOpenAIClient();
            const storyTranslationResponse = await openai.beta.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an assistant that translates text accurately into various languages.' },
                    { role: 'user', content: `Translate this story into ${language} and return it in a JSON object with a 'story' field: \n\n${story}` },
                ],
                response_format: zodResponseFormat(TranslatedStory, 'translated_story'),
            });
            const translatedStory = storyTranslationResponse.choices[0].message.parsed.story;
            console.log('Translated story:', translatedStory);
            return translatedStory;
        } catch (error) {
            console.error('Error translating story:', error);
            throw error;
        }
    }

    static async translateTitle(title, language) {
        try {
            const openai = getOpenAIClient();
            const titleTranslationResponse = await openai.beta.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an assistant that translates text accurately into various languages.' },
                    { role: 'user', content: `Translate this title into ${language} and return it in a JSON object with a 'title' field: "${title}"` },
                ],
                response_format: zodResponseFormat(TranslatedTitle, 'translated_title'),
            });
            const translatedTitle = titleTranslationResponse.choices[0].message.parsed.title;
            return translatedTitle;
        } catch (error) {
            console.error('Error translating title:', error);
            throw error;
        }
    }

    static async translateStoryAndTitle(story, title, language) {
        try {
            const [translatedStory, translatedTitle] = await Promise.all([
                this.translateStory(story, language),
                this.translateTitle(title, language)
            ]);
            return { translatedStory, translatedTitle };
        } catch (error) {
            console.error('Error translating story and title:', error);
            throw error;
        }
    }

    static async getSentences(text, language) {
        try {
            console.log('Getting sentences...');
            const openai = getOpenAIClient();
            const sentencesTranslationResponse = await openai.beta.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an assistant that translates text accurately into various languages.' },
                    { role: 'user', content: sentencesInstruction(text, language) },
                ],
                response_format: zodResponseFormat(SentencesResponse, 'sentences'),
            });
            console.log('Sentences translation response:', sentencesTranslationResponse);
            const sentencesArray = sentencesTranslationResponse.choices[0].message.parsed.sentences;
            console.log('Sentences:', sentencesArray);
            return sentencesArray;
        } catch (error) {
            console.error('Error getting sentences:', error);
            throw error;
        }
    }

    static async getWords(sentences, language, context) {
        try {
            console.log('Getting words...');
            const openai = getOpenAIClient();
            const wordTranslationResponse = await openai.beta.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an assistant that translates text accurately into various languages.' },
                    { role: 'user', content: wordsInstruction(sentences, context) },
                ],
                response_format: zodResponseFormat(WordsResponse, 'words'),
            });
            const words = wordTranslationResponse.choices[0].message.parsed.words;
            console.log('Words:', words);
            return words;
        } catch (error) {
            console.error('Error getting words:', error);
            throw error;
        }
    }
}

const sentencesInstruction = (text, language) => {
    const instruction = `
    Translate this text from ${language} to English. 
    Return the individual sentences JSON object that looks like this:
    {
        "sentences": [
            ... the translated sentence object that has the shape { original: string in original language, translation: string in English}
        ]
    }
    Text: ${text}`
    console.log('instruction', instruction);
    return instruction;
}

const wordsInstruction = (sentences, context) => {
    const instruction = `
    Translate this array of sentences into English 
    ${sentences}
    Output the sentences into the following JSON format:
    A JSON object with a field called words which is an array of JSON objects. 
    The indices in the first array correspond to the indices in the sentences array.
    The second array is a list of objects corresponding to individual words in the sentence for that index.
    Ignore punctuation and other non-word characters.
    Each object should have the following structure:
    {
        "word": "the actual word in the sentence",
        "translation": "the correct English translation of the word as it makes sense in the context of the sentence.${context !== NO_TRANSLATION_CONTEXT ? ' ' + context : ''}",
        "explanation": "an explanation of the translation in the context of the sentence using very basic English. For example 'Pipo jumped high' would save 'Character in the sentence' for Pipo, 'jumped' would be 'what Pipo did', and 'high' would be 'the height of the jump'."
    }
    `;
    console.log('instruction', instruction);
    return instruction;
}

const TitleAndStory = z.object({
    title: z.string(),
    story: z.string(),
});

const Word = z.object({
    word: z.string(),
    translation: z.string(),
    explanation: z.string(),
});
const Words = z.array(Word);
const WordsResponse = z.object({
    words: z.array(Words)
});

const Sentences = z.object({
    original: z.string(),
    translation: z.string(),
});

const SentencesResponse = z.object({
    sentences: z.array(Sentences)
});

const TranslatedStory = z.object({
    story: z.string()
});

const TranslatedTitle = z.object({
    title: z.string()
});

export default GenAIAPI;
