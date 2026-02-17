module.exports = (input)=>{
  function findKeysWithNullOrUndefined(obj, path = []) {
    return Object.keys(obj).reduce((keys, key) => {
      const currentPath = path.concat(key);
      const value = obj[key];
  
      if (value === null || value === "" || value === undefined) {
        keys.push(currentPath.join("."));
      }
  
      if (typeof value === "object" && value !== null) {
        keys = keys.concat(findKeysWithNullOrUndefined(value, currentPath));
      }
  
      return keys;
    }, []);
  }
  let errorMap = [];
  let excludedKeys =[];
  input.currentRoutes.map((route,rIndex)=>{
    let routeKey1 = `currentRoutes.${rIndex}.businessTag`;
    let routeKey2 = `currentRoutes.${rIndex}.comments`;
    excludedKeys.push(routeKey1,routeKey2)
    route.destinations.map((_,dIndex)=>{
        let destinationKey = `currentRoutes.${rIndex}.destinations.${dIndex}.remoteSite.remoteFolder`;
       let filePath = `currentRoutes.${rIndex}.destinations.${dIndex}.pgpEncrypt.key.tempFilePath`;
       let filePath1 = `currentRoutes.${rIndex}.destinations.${dIndex}.pgpEncrypt.key`;
       let siteTriggerPattern = `currentRoutes.${rIndex}.destinations.${dIndex}.remoteSite.namingPattern`
         excludedKeys.push(...[filePath,filePath1,destinationKey,siteTriggerPattern]);
    })
  })
function subtractArrays(array1, array2) {
  return array1.filter(item => !array2.includes(item));
}
 let mapToCheck = {"currentRoutes":input.currentRoutes};
 let errorDescriptionMap = {"routeName":"File Route Name","clientName":"Select Client","fileDescription":"File Description","fileNamingPattern":"File Naming Pattern","fileNamingExample":"File Name Example","fileId":"File ID","destinationName":"File Destination Name","destinationType":"Select Destination Type","folderType":"Select Folder Type","folder":"Folder Name","name":"Select Remote Site","remoteFolder":"Remote Folder","namingPattern":"File Naming Pattern/Filter","emails":"Email Address(s)","renamingExample":"Renaming Example","accountName":"Account","renameExample":"Renaming Example"}
  let invalidKeys = subtractArrays(findKeysWithNullOrUndefined(mapToCheck),excludedKeys);
  invalidKeys.map((it)=>{
          let field = it;
          let splitedArray = it.split('.');
          let errorField = errorDescriptionMap[splitedArray[splitedArray.length - 1]]
          || "";
          let description = `Please provide valid ${errorField}`;
          let error = {"forField":field,"code":400,"description":description}
          errorMap.push(error)
      })
      if (input.cmrNumber && input.cmrNumber === undefined || input.cmrNumber === "") {
        let error = {
          forField: "cmrNumber",
          code: 400,

          description: "Please provide valid CMR Number",
        };
        invalidKeys.push("cmrNumber");
        errorMap.push(error);
      }
  return {"hasErrors":invalidKeys.length>0,"errorMap":errorMap};
  }