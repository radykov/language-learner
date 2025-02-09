import { useState, useEffect, useCallback } from "react";

const PUBLIC_URI = process.env.PUBLIC_URL;

function getStoryURI(storyPath, language) {
    return `${PUBLIC_URI}/stories/${storyPath}/${language}.json`;
}

function getStoriesURI() {
    return `${PUBLIC_URI}/stories/stories.json`;
}

const useStoryCache = () => {
    const [cache, setCache] = useState({});

    const fetchStory = useCallback(async (storyPath, language) => {
        const cacheKey = `${storyPath}-${language}`;

        if (cache[cacheKey]) {
            return cache[cacheKey];
        }

        const uri = getStoryURI(storyPath, language);
        let response = null;
        try {
            response = await fetch(uri);
            const storyData = await response.json();

            setCache(prevCache => ({
                ...prevCache,
                [cacheKey]: storyData
            }));

            return storyData;
        } catch (error) {
            console.log(response);
            console.error(`Error loading ${language} story via ${uri}, response: ${response}:`, error);
            throw error;
        }
    }, [cache,]);

    return fetchStory;
};

const useFetchData = (storyPath, selectedLanguage) => {
    const [data, setData] = useState(null);
    const [stories, setStories] = useState([]);
    const [currentStoryTitle, setCurrentStoryTitle] = useState("");
    const [initialStoryPath] = useState(storyPath);
    const fetchStory = useStoryCache();

    useEffect(() => {
        setData(null);

        const fetchData = async () => {
            try {
                const translatedStory = await fetchStory(storyPath, selectedLanguage);
                setData(translatedStory);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, [fetchStory, storyPath, selectedLanguage]);

    useEffect(() => {
        const story = stories.find(story => story.path === storyPath);
        if (story) {
            setCurrentStoryTitle(story.title);
        }
    }, [storyPath, stories]);

    // Fetch stories list
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(getStoriesURI());
                const data = await response.json();
                setStories(data.stories);
                // Set initial story title
                const initialStory = data.stories.find(story => story.path === initialStoryPath);
                if (initialStory) {
                    setCurrentStoryTitle(initialStory.title);
                }
            } catch (error) {
                console.error('Error loading stories:', error);
            }
        };
        fetchStories();
    }, [initialStoryPath]);

    return { data, stories, currentStoryTitle };
};

export default useFetchData;
