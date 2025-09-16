module.exports = function (input, options = {}) {
  const {
    removeEmptyArrays = false,
    removeEmptyObjects = false,
  } = options;
  const skipEmptyValuesInput = input?.skipEmptyValues;
  const skipEmptyValues = typeof skipEmptyValuesInput === 'boolean' ? skipEmptyValuesInput : skipEmptyValuesInput === 'false' ? false : true;

  function clean(obj) {
    try{
    if (Array.isArray(obj)) {
      const cleanedArray = obj
        .map(clean)
        .filter(v => v !== null && v !== undefined && (!skipEmptyValues ? v !== '': true));

      return removeEmptyArrays && cleanedArray.length === 0
        ? undefined
        : cleanedArray;
    }

    if (typeof obj === 'object' && obj !== null) {
      const cleanedObj = {};

      for (let key in obj) {
        const value = clean(obj[key]);

        if (value !== null && value !== undefined && (!skipEmptyValues ? value !== '' : true)) {
          cleanedObj[key] = value;
        }
      }

      if (removeEmptyObjects && Object.keys(cleanedObj).length === 0) {
        return undefined;
      }

      return cleanedObj;
    }

    return obj;
  }
  catch (error) {
    return {
      hasErrors: true, 
      error: error
    };
  }
}

  return input.data ? clean(input.data) : input.data;
}