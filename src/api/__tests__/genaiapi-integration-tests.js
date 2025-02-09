import GenAIAPI from '../genaiapi';
import { FRENCH_TEST_DATA } from './test-data-french';
import { MANDARIN_TEST_DATA } from './test-data-mandarin';

const TEST_PROMPT = "Write a short story about a penguin named Pipo who learns to dance";
const TEST_STORY = "Pipo was a small penguin who lived in Antarctica. One day, he discovered music.";

const LANGUAGE_TEST_DATA = {
    'French': FRENCH_TEST_DATA,
    'Mandarin': MANDARIN_TEST_DATA
};

const tests = {
    async testGenerateStoryAndTitle() {
        console.log('\nTesting generateStoryAndTitle...');
        try {
            const result = await GenAIAPI.generateStoryAndTitle(TEST_PROMPT);
            console.log('Result:', result);
            console.assert(result.story && result.title, 'Story and title should be present');
            console.log('✅ Test passed');
            return result;
        } catch (error) {
            console.error('❌ Test failed:', error);
            throw error;
        }
    },

    async testTranslation(language = 'French') {
        console.log(`\nTesting translation for ${language}...`);
        try {
            const testData = LANGUAGE_TEST_DATA[language];
            const result = await GenAIAPI.translateStory(TEST_STORY, language);
            console.log('Translated story:', result);
            console.assert(result, 'Translation should not be empty');
            if (testData) {
                console.assert(
                    result.toLowerCase().includes(testData.expectedTranslation.story.toLowerCase()),
                    'Translation should match expected output'
                );
            }
            console.log('✅ Test passed');
            return result;
        } catch (error) {
            console.error('❌ Test failed:', error);
            throw error;
        }
    },

    async testGetSentences(language = 'French') {
        console.log(`\nTesting getSentences for ${language}...`);
        try {
            const testData = LANGUAGE_TEST_DATA[language];
            console.log('Test data:', testData);
            const result = await GenAIAPI.getSentences(testData.story, language);
            console.log('Sentences:', result);
            console.assert(Array.isArray(result), 'Result should be an array');
            console.assert(result.length > 0, 'Should have at least one sentence');
            console.assert(
                result.length === testData.expectedSentences.length,
                'Should have correct number of sentences'
            );
            console.log('✅ Test passed');
            return result;
        } catch (error) {
            console.error('❌ Test failed:', error);
            throw error;
        }
    },

    async testGetWords(language = 'French') {
        console.log(`\nTesting getWords for ${language}...`);
        try {
            const testData = LANGUAGE_TEST_DATA[language];
            const sentences = testData.expectedSentences;
            const result = await GenAIAPI.getWords(sentences, language, 'No special context');
            console.log('Words:', result);
            console.assert(Array.isArray(result), 'Result should be an array');
            console.assert(result.length > 0, 'Should have at least one word array');
            console.log('✅ Test passed');
            return result;
        } catch (error) {
            console.error('❌ Test failed:', error);
            throw error;
        }
    }
};

// Modified runAllTests to handle results and errors
// Leaving this here for reference but haven't tested it in the latest versions
// async function runAllTests() {
//     const results = {};
//     try {
//         results.storyAndTitle = await tests.testGenerateStoryAndTitle();
//         for (const language of Object.keys(LANGUAGE_TEST_DATA)) {
//             results[language] = {
//                 translation: await tests.testTranslation(language),
//                 sentences: await tests.testGetSentences(language),
//                 words: await tests.testGetWords(language)
//             };
//         }
//         return results;
//     } catch (error) {
//         throw error;
//     }
// }

export default tests; 