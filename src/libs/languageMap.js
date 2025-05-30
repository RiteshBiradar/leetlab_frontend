export const getLanguageId = (language)=>{
    const languages = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }
    return languages[language.toUpperCase()];
} 
