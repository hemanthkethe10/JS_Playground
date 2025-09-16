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
    let currentDestination = finalMap.find((route)=>route.routeName === input.scriptData.routeName && route.destination.destinationName === input.scriptData.destinationName)
    function checkStepExistence(stepName){
        return  input.scriptData.stepsList.includes(stepName)
    }    
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
       "successEmailTemplate": currentDestination.destination.successDelivery.enabled === "true" ?input.scriptData.successTemplate : "",
       "successEmailName": currentDestination.destination.successDelivery.emails,
        "steps":[]
    }
    if(checkStepExistence('setflowattributes')){
        let fileDetails = input.scriptData.fileDetails;
        let attributesList = `fileID=${currentDestination?.fileId}\nIDValue=${currentDestination?.idValue}\nType=${fileDetails?.type}\nDivison=${fileDetails?.fileDetails?.at(0)?.division}\nData sensitivity=${fileDetails?.fileDetails?.at(0)?.dataSensitivity}\nbusinessTag=${currentDestination?.businessTag}\ncomments=${currentDestination?.comments}`;
        let setAttributesPayload = {
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
          stDataForAPI.steps.push(setAttributesPayload)
    }
    if (currentDestination.pgpDecrypt.enabled === "true" && checkStepExistence('PgpDecryption'))
    {
        let pgpDecrypt = {
            "type": "PgpDecryption",
            "status": "ENABLED",
            "autostart": false,
            "actionOnStepSuccess": "PROCEED",
            "actionOnStepFailure":"FAIL",
            "requireTrustedSignature": currentDestination.pgpDecrypt.requireSignature,
            "usePrecedingStepFiles": true,
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB"
        }
        stDataForAPI.steps.push(pgpDecrypt)
    }
    if (currentDestination.destination.renameFile.enabled === "true" && checkStepExistence('Rename')){
        let renameFile =    {
            "type": "Rename",
            "status": "ENABLED",
            "autostart": false,
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB",
            "actionOnStepSuccess": "PROCEED",
            "actionOnStepFailure":"FAIL",
            "outputFileName":`${currentDestination.destination.renameFile.renameExpression}`,
            "usePrecedingStepFiles": true
        }
        stDataForAPI.steps.push(renameFile)
    }
    if (currentDestination.destination.encodingConversions.enabled === "true" && checkStepExistence('EncodingConversion')){
        let encodingPayload =     {
            "type": "EncodingConversion",
            "status": "ENABLED",
            "autostart": false,
            "actionOnStepSuccess": "PROCEED",
            "actionOnStepFailure": "FAIL",
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB",
            "inputCharset": currentDestination.destination.encodingConversions.source,
            "outputCharset": currentDestination.destination.encodingConversions.output,
            "usePrecedingStepFiles": true
        }
        stDataForAPI.steps.push(encodingPayload)
    }
    switch (currentDestination.destination.destinationType){
        case "TransferAccount" : 
        case "ApplicationAccount": if(checkStepExistence('Publish')){
            let accountPayload =    {
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
        case "InternalSite": if(checkStepExistence('SendToPartner')){
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