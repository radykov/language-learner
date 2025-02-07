import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStoryCache from './useFetchData';
import { LANGUAGES } from '../constants/languages';

const useStoryManager = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const fetchStory = useStoryCache();

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [storyPath, setStoryPath] = useState('');
    const [stories, setStories] = useState([]);
    const [currentStoryTitle, setCurrentStoryTitle] = useState('');
    const [data, setData] = useState(null);
    const [translationCache, setTranslationCache] = useState({});
    const [selectedSentence, setSelectedSentence] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);

    // Initialize state from URL params
    useEffect(() => {
        const urlLanguage = searchParams.get('language');
        const urlStoryPath = searchParams.get('story');

        if (urlLanguage && LANGUAGES.some(lang => lang.code === urlLanguage)) {
            setSelectedLanguage(urlLanguage);
        }
        if (urlStoryPath) {
            setStoryPath(urlStoryPath);
        }
    }, [searchParams]);

    // Update URL when language or story changes
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('language', selectedLanguage);
        params.set('story', storyPath);
        navigate(`?${params.toString()}`, { replace: true });
    }, [selectedLanguage, storyPath, navigate]);

    // Fetch stories list
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('/stories/stories.json');
                const data = await response.json();
                setStories(data.stories);

                const initialStory = data.stories.find(story => story.path === storyPath);
                if (initialStory) {
                    setCurrentStoryTitle(initialStory.title);
                }
            } catch (error) {
                console.error('Error loading stories:', error);
            }
        };
        fetchStories();
    }, [storyPath]);

    // Update current story title when storyPath changes
    useEffect(() => {
        const story = stories.find(story => story.path === storyPath);
        if (story) {
            setCurrentStoryTitle(story.title);
        }
    }, [storyPath, stories]);

    // Fetch story translation
    useEffect(() => {
        setTranslationCache({});
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
    }, [selectedLanguage, storyPath, fetchStory]);

    // Reset selection when language changes
    useEffect(() => {
        setSelectedSentence(null);
        setSelectedWord(null);
    }, [selectedLanguage]);

    return {
        selectedLanguage,
        setSelectedLanguage,
        storyPath,
        setStoryPath,
        stories,
        currentStoryTitle,
        data,
        translationCache,
        setTranslationCache,
        selectedSentence,
        setSelectedSentence,
        selectedWord,
        setSelectedWord,
    };
};

export default useStoryManager;
