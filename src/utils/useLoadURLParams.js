import { LANGUAGES } from "../constants/languages";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const useLoadUrlParams = () => {
    const [searchParams] = useSearchParams();
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        const urlLanguage = searchParams.get('language');
        if (urlLanguage && LANGUAGES.some(lang => lang.code === urlLanguage)) {
            return urlLanguage;
        }

        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage && LANGUAGES.some(lang => lang.code === storedLanguage)) {
            return storedLanguage;
        }
        return 'french';
    });

    const [storyPath, setStoryPath] = useState(() => {
        const urlStoryPath = searchParams.get('story');
        if (urlStoryPath) {
            return urlStoryPath;
        }
        const storedStoryPath = localStorage.getItem('storyPath');
        return storedStoryPath || 'cat_that_lost_its_hat'; // Default story
    });

    useEffect(() => {
        localStorage.setItem('language', selectedLanguage);
    }, [selectedLanguage]);

    useEffect(() => {
        localStorage.setItem('storyPath', storyPath);
    }, [storyPath]);

    return { selectedLanguage, setSelectedLanguage, storyPath, setStoryPath };
};

export default useLoadUrlParams;
