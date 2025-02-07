import { useEffect } from "react";
import { LANGUAGES } from "../constants/languages";
import { useSearchParams } from "react-router-dom";

const useLoadUrlParams = (setSelectedLanguage, setStoryPath) => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const urlLanguage = searchParams.get('language');
        const urlStoryPath = searchParams.get('story');

        if (urlLanguage && LANGUAGES.some(lang => lang.code === urlLanguage)) {
            setSelectedLanguage(urlLanguage);
        }
        if (urlStoryPath) {
            setStoryPath(urlStoryPath);
        }
    }, []);
};

export default useLoadUrlParams;
