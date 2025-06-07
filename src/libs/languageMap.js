export const getLanguageId = (language)=>{
    const languages = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }
    return languages[language.toUpperCase()];
} 


export const getDifficultyColor = (difficulty) => {
    const map = {
      EASY: "bg-green-100 text-green-700 border-green-200",
      MEDIUM: "bg-orange-100 text-orange-700 border-orange-200", 
      HARD: "bg-red-100 text-red-700 border-red-200",
    }
    return map[difficulty] || "bg-gray-100 text-gray-700 border-gray-200"
  }