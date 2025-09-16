function run(input) {
  function getEmptyOrUndefinedKeys(obj) {
    const emptyKeys = [];

    function checkProperties(object, currentKey) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const value = object[key];

          if (typeof value === "object") {
            // Recursively check nested objects
            checkProperties(value, `${currentKey}.${key}`);
          } else if (value === "" || value === undefined) {
            let keyToPush = `${currentKey}.${key}`.startsWith(".")
              ? `${currentKey}.${key}`.slice(1)
              : `${currentKey}.${key}`;
            emptyKeys.push(keyToPush);
          }
        }
      }
    }

    checkProperties(obj, "");

    return emptyKeys;
  }
  //to check map is empty
  function isObjectEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false; 
      }
    }
    return true; 
  }
  const emptyOrUndefinedKeys = getEmptyOrUndefinedKeys(input.body)
  const pgpDecrypt = input.body?.updateRoute?.at(input.body.routeIndex)?.pgpDecrypt;
  if (pgpDecrypt && isObjectEmpty(pgpDecrypt)){
    emptyOrUndefinedKeys.push(`updateRoute.${input.body.routeIndex}.pgpDecrypt.requireSignature`)
  }
  const filteredUndefinedKeys = emptyOrUndefinedKeys.filter(
    (str) => {
      if (str.includes("updateDestination")) {
        return (
          str.includes(`updateRoute.${input.body.routeIndex}`) &&
          str.includes(`updateDestination.${input.body.destinationIndex}`)
        );
      } else {
        // Check if 'updateRoute.0' exists in the array
        return str.includes(`updateRoute.${input.body.routeIndex}`);
      }
    }
  );
  let errorMap = [];
    let descriptionMap = {
    "folderType":"Please provide Subscription Folder",
    "schedule":"Please provide File Fetching Schedule",
    "cron":"Please provide Cron Expression",
    "renameExpression":"Please provide File Rename Expression",
    "source":"Please provide Source File Encoding",
    "output":"Please provide  Output File Encoding",
    "requireSignature":"Please provide Require Trusted Signature",
    "folderName":"Please provide Folder Name"
  }
  filteredUndefinedKeys.map((key) => {
    let descriptionKey = key.split('.').pop();
    let description = descriptionMap[descriptionKey] || "Please provide selection";
    let error = {
      forField: key,
      code: 400,
      description: description,
    };
    errorMap.push(error);
  });
  return errorMap;
}
module.exports = run;
let input = {
  body:  {
		"requestId": "RRN00340",
		"routeName": "PHN",
		"destinationName": "MFTA",
		"fileId": "F00023",
		"routeIndex": 0,
		"destinationIndex": 0,
		"clientName": "John5_Walmart"
	}
};
run(input);
