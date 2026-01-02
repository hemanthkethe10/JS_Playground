function run(input) {
    function getEmptyOrUndefinedKeys(obj, keysToCheck) {
      const emptyKeys = [];
  
      function checkProperties(object, currentKey) {
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const value = object[key];
  
            // Only check if this key is in our keysToCheck array
            if (keysToCheck.includes(key)) {
              if (value === "" || value === undefined || value === null) {
                let keyToPush = `${currentKey}.${key}`.startsWith(".")
                  ? `${currentKey}.${key}`.slice(1)
                  : `${currentKey}.${key}`;
                emptyKeys.push(keyToPush);
              }
            }
  
            // Still traverse nested objects
            if (typeof value === "object" && value !== null) {
              checkProperties(value, `${currentKey}.${key}`);
            }
          }
        }
      }
  
      checkProperties(obj, "");
      return emptyKeys;
    }
  
    let descriptionMap = {
      "siteName": "Please provide Site Name",
      "networkZone": "Please provide Network Zone",
      "cmrNumber": "Please provide CMR Number",
      "protocol": "Please provide Protocol",
      "host": "Please provide Server",
      "port": "Please provide Port",
      "userName": "Please provide User Name",
      "loginType": "Please provide Login Type"
    };
  
    // Get only the keys we want to check
    const keysToCheck = Object.keys(descriptionMap);
    
    let bodyToCheck = input.body?.at(input.siteIndex) || {};
    const emptyOrUndefinedKeys = getEmptyOrUndefinedKeys(bodyToCheck, keysToCheck);
  
    let errorMap = [];
    
    emptyOrUndefinedKeys.forEach((key) => {
      let descriptionKey = key.split('.').pop();
      let description = descriptionMap[descriptionKey];
      let error = {
        forField: `transferSites.${input.siteIndex}.${key}`,
        code: 400,
        description: description,
      };
      errorMap.push(error);
    });
    
    return errorMap;
  }
  module.exports = run;