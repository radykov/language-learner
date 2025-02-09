import { LANGUAGES } from "../constants/languages";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const useLoadUrlParams = () => {
    const [searchParams] = useSearchParams();
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        const urlLanguage = searchParams.get('language');
        if (urlLanguage && LANGUAGES.some(lang => lang.code === urlLanguage)) {
            return urlLanguage;
        }
        return 'french';
    });

    const [storyPath, setStoryPath] = useState(() => {
        const urlStoryPath = searchParams.get('story');
        if (urlStoryPath) {
            return urlStoryPath;
        }
        return 'cat_that_lost_its_hat';
    });

    return { selectedLanguage, setSelectedLanguage, storyPath, setStoryPath };
};

export default useLoadUrlParams;
