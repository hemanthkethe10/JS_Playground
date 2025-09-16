
const words = ['rates', 'rat', 'stare', 'taser', 'tears', 'art', 'tabs', 'tar', 'bats', 'state'];

function anagramGroups(wordAry){
    const groupedWords = {};

    // iterate over each word in the array
    wordAry.map(word => {
      // alphabetize the word and a separate variable
      let alphaWord = word.split('').sort().join('');
      // if the alphabetize word is already a key, push the actual word value (this is an anagram)
      if(groupedWords[alphaWord]) {
        return groupedWords[alphaWord].push(word);
      }
      // otherwise add the alphabetize word key and actual word value (may not turn out to be an anagram)
      groupedWords[alphaWord] = [word]; 
    })
    debugger;
    return groupedWords;
}

// call the function and store results in a variable called collectedAnagrams
const collectedAnagrams = anagramGroups(words);

// iterate over groupedAnagrams, printing out group of values
for(const sortedWord in collectedAnagrams) {
  if(collectedAnagrams[sortedWord].length > 1) { 
    console.log(collectedAnagrams[sortedWord].toString());
  }
}