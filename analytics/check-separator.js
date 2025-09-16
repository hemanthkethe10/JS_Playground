const stopwords = [
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'has',
    'have', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'let', 'more', 'nor',
    'of', 'on', 'or', 'over', 'so', 'that', 'the', 'to', 'under', 'until', 'when',
    'where', 'which', 'with', 'you', 'your', 'yours', 'while'
  ];
  
  function containsSeparator(searchString) {
    const words = searchString.toLowerCase().split(/\s+/); 
    for (let word of words) {
      if (stopwords.includes(word)) {
        return true;  
      }
    }
    return false; 
  }
  
  const searchString = "Find files for logs.txt";
  if (containsSeparator(searchString)) {
    console.log("The search string contains a separator word.");
  } else {
    console.log("The search string does not contain any separator words.");
  }
  