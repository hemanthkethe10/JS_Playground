module.exports = (input) => {
    let finalMap = [];
input.scriptData.request.currentRoutes.forEach((route) => {
  route.destinations.forEach((destination) => {
    const newRoute = { ...route }; 
    newRoute.destination = destination;
    delete newRoute.destinations; 
    finalMap.push(newRoute);
  });
});
function checkStepExistence(stepName){
    return  input.scriptData.stepsList.includes(stepName)
}
let currentDestination = finalMap.find((route)=>route.routeName === input.scriptData.routeName && route.destination.destinationName === input.scriptData.destinationName)
        
    let stDataForAPI = {
        "name":`${currentDestination.routeName}-${currentDestination.destination.destinationName}`,
        "description":`${currentDestination.fileDescription}\n fileNamingExample = ${currentDestination.fileNamingExample}`,
        "type":"SIMPLE",
        "condition":`\${filename(transfer.targetFull).matches('${currentDestination.fileNamingPattern}')}`,
        "conditionType":"EL",
        "failureEmailNotification": currentDestination.destination.failedDelivery.enabled,
        "failureEmailTemplate": currentDestination.destination.failedDelivery.enabled === "true" ?input.scriptData.failureTemplate : "",
        "failureEmailName": currentDestination.destination.failedDelivery.emails,
        "successEmailNotification": currentDestination.destination.successDelivery.enabled,
        "successEmailTemplate": currentDestination.destination.successDelivery.enabled  === "true" ?input.scriptData.successTemplate : "",
      "successEmailName": currentDestination.destination.successDelivery.emails,
        "steps":[]
    }
    //{"stepType":["CharactersReplace","Compress","Decompress","EncodingConversion","ExternalScript","LineEnding","LineFolding","LinePadding","LineTruncating","PgpDecryption","PgpEncryption","Rename","setflowattributes","Publish","PullFromPartner","SendToPartner"]}
    if(checkStepExistence('setflowattributes')){
        let fileDetails = input.scriptData.fileDetails;
        let attributesList = `fileID=${currentDestination?.fileId}\nIDValue=${currentDestination?.idValue}\nType=${fileDetails?.type}\nDivison=${fileDetails?.fileDetails?.at(0)?.division}\nData sensitivity=${fileDetails?.fileDetails?.at(0)?.dataSensitivity}\nbusinessTag=${currentDestination?.businessTag}\ncomments=${currentDestination?.comments}`;
        let flowattributesPayload ={
            "type": "setflowattributes",
            "status": "ENABLED",
            "autostart": false,
            "actionOnStepSuccess": "PROCEED",
            "actionOnStepFailure":"FAIL",
            "customProperties": {
              "usePrecedingStepFiles": "true",
              "attributesMode": "add-or-modify",
              "attributesSet": attributesList
            }
          }
          stDataForAPI.steps.push(flowattributesPayload)
    }
    if (currentDestination.renameFile.enabled === "true" && checkStepExistence('Rename')){
        let renameFile =    {
            "type": "Rename",
            "status": "ENABLED",
            "autostart": false,
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB",
              "actionOnStepSuccess": "PROCEED",
               "actionOnStepFailure":"FAIL",
            "outputFileName":`${currentDestination.renameFile.renameExpression}`,
            "usePrecedingStepFiles": true
        }
        stDataForAPI.steps.push(renameFile)
    }

    if (currentDestination.encodingConversions.enabled === "true" && checkStepExistence('EncodingConversion')){
        let encodingPayload =     {
            "type": "EncodingConversion",
            "status": "ENABLED",
            "autostart": false,
            "actionOnStepSuccess": "PROCEED",
            "actionOnStepFailure": "FAIL",
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB",
            "inputCharset": currentDestination.encodingConversions.source,
            "outputCharset": currentDestination.encodingConversions.output,
            "usePrecedingStepFiles": true
        }
        stDataForAPI.steps.push(encodingPayload)
    }
    if (currentDestination.destination.pgpEncrypt.enabled === "true" && checkStepExistence('PgpEncryption'))
    {
        let pgpEncryptPayload = {
      "type": "PgpEncryption",
      "status": "ENABLED",
      "autostart": false,
      "actionOnStepSuccess": "PROCEED",
      "actionOnStepFailure": "FAIL",
      "encryptKeyExpression": currentDestination.destination.pgpEncrypt.key,
      "encryptKeyExpressionType": "ALIAS",
      "encryptKeyOwnerExpression": input.scriptDatarequest.account,
      "encryptKeyOwnerExpressionType": "NAME",
      "compressionType": "0",
      "fileFilterExpression": "*",
      "fileFilterExpressionType": "GLOB"
    }
        stDataForAPI.steps.push(pgpEncryptPayload)
    }
    if (currentDestination.destination.requirePassword.enabled === "true" && checkStepExistence('Decompress'))
    {
        let passwordPayload = {
      "type": "Decompress",
      "status": "ENABLED",
      "autostart": false,
      "actionOnStepSuccess": "PROCEED",
      "actionOnStepFailure": "FAIL",
      "fileFilterExpression": "*",
      "fileFilterExpressionType": "GLOB",
      "filenameCollisionResolutionType": "OVERWRITE",
      "zipPassword": currentDestination.destination.requirePassword.password,
      "postTransformationActionRenameAsExpression": null,
      "usePrecedingStepFiles": true
    }
        stDataForAPI.steps.push(passwordPayload)
    }
    switch (currentDestination.destination.destinationType){
        case "NYLhosted": if(checkStepExistence('Publish'))
        {
            let accountPayload = {
                "type": "Publish",
                "status": "ENABLED",
                "autostart": false,
                "usePrecedingStepFiles": true,
                "fileFilterExpression": "*",
                "fileFilterExpressionType": "GLOB",
                "actionOnStepSuccess": "PROCEED",
                "actionOnStepFailure":"FAIL",
                "filenameCollisionResolutionType": "FAIL",
                "targetAccountExpression": currentDestination.destination.accountName,
                "targetAccountExpressionType": "NAME",
                "targetFolderExpression": currentDestination.destination.folder,
                "targetFolderExpressionType": "SIMPLE"
              }
              stDataForAPI.steps.push(accountPayload);
              break;
        }
        case "Partnerhosted": if(checkStepExistence('SendToPartner'))
        {
        let sitePayload = {
          "type": "SendToPartner",
          "status": "ENABLED",
          "autostart": false,
          "fileFilterExpression": "*",
          "fileFilterExpressionType": "GLOB",
          "actionOnStepSuccess": "PROCEED",
          "actionOnStepFailure":"FAIL",
          "targetAccountExpression": currentDestination.destination.accountName,
	  "targetAccountExpressionType": "EXPRESSION",
          "transferSiteExpression": `${currentDestination.destination.remoteSite.name}#!#CVD#!#`,
          "transferSiteExpressionType": "LIST",
          "uploadFolder":currentDestination.destination.remoteSite.remoteFolder
        }
            stDataForAPI.steps.push(sitePayload);
                break;
        }
            default : {}
        }
    return stDataForAPI;
    }