import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUpdateQueryParams = (selectedLanguage, storyPath) => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("language", selectedLanguage);
        params.set("story", storyPath);
        navigate(`?${params.toString()}`, { replace: true });
    }, [selectedLanguage, storyPath, navigate]);
};

export default useUpdateQueryParams;
