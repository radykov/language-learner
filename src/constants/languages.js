const chineseTranslation = (romanization, example) => {
    return `Make sure to translate words and not individual characters, e.g. 你好 should be one word and not two like 你 and 好. Include the ${romanization} and the direct meaning of the separate characters too. Example: ${example}`;
}

export const NO_TRANSLATION_CONTEXT = null;
export const LANGUAGES = [
    { code: 'french', emoji: '🇫🇷', name: 'French', translation_context: NO_TRANSLATION_CONTEXT },
    { code: 'spanish', emoji: '🇪🇸', name: 'Spanish', translation_context: NO_TRANSLATION_CONTEXT },
    { code: 'mandarin', emoji: '🇨🇳', name: 'Mandarin', translation_context: chineseTranslation('pinyin', 'e.g. 你好 is translated as "hello - 你 ni3 (you) 好 hao3 (good)"') },
    { code: 'cantonese', emoji: '🇭🇰', name: 'Cantonese', translation_context: chineseTranslation('jyutping', 'e.g. 你好 is translated as "hello - 你 nei5 (you) 好 hou2 (good)"') },
];
