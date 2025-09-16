module.exports = (input) => {
    let finalMap = [];
    input.request.currentRoutes.map((route)=>{
        route.destinations.map((destination)=> {
              delete route.destinations;
              route.destination = destination
              finalMap.push(route)
        })
    })
    let currentDestination = finalMap.find((route)=>route.routeName === input.routeName && route.destination.destinationName === input.destinationName)
    
    let attributesList = `fileID=${currentDestination.fileId}\nIDValue=${currentDestination.idValue}\nType=${input.fileDetails.type}\nDivison=${input.fileDetails.division}\nData sensitivity=${input.fileDetails.dataSensitivty}\nbusinessTag=${currentDestination.businessTag}\ncomments=${currentDestination.comments}`;
    
    let stDataForAPI = {
        "name":`${currentDestination.routeName}-${currentDestination.destination.destinationName}`,
        "description":`${currentDestination.fileDescription}\n fileNamingExample = ${currentDestination.fileNamingExample}`,
        "type":"SIMPLE",
        "condition":`\${filename(transfer.targetFull).matches('${currentDestination.fileNamingPattern}')}`,
        "conditionType":"EL",
        "failureEmailNotification": currentDestination.destination.failedDelivery.enabled,
      "failureEmailTemplate": input.failureTemplate,
      "failureEmailName": currentDestination.destination.failedDelivery.emails,
      "successEmailNotification": currentDestination.destination.successDelivery.enabled,
      "successEmailTemplate": input.successTemplate,
      "successEmailName": currentDestination.destination.successDelivery.emails,
        "steps":[
            {
          "type": "setflowattributes",
          "status": "ENABLED",
          "autostart": false,
          "conditionType": "ALWAYS",
          "condition": "",
          "actionOnStepSuccess": "PROCEED",
          "actionOnStepFailure":"FAIL",
          "customProperties": {
            "usePrecedingStepFiles": "true",
            "attributesMode": "add-or-modify",
            "attributesSet": attributesList
          }
        }
        ]
    }
    if (currentDestination.renameFile.enabled === "true"){
        let renameFile =    {
            "type": "Rename",
            "status": "ENABLED",
            "autostart": false,
            "conditionType": "ALWAYS",
            "condition": "",
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB",
              "actionOnStepSuccess": "PROCEED",
               "actionOnStepFailure":"FAIL",
            "outputFileName":`${currentDestination.renameFile.renameExample}`,
            "usePrecedingStepFiles": true
        }
        stDataForAPI.steps.push(renameFile)
    }

    if (currentDestination.encodingConversions.enabled === "true"){
        let encodingPayload =     {
            "type": "EncodingConversion",
            "status": "ENABLED",
            "autostart": false,
            "conditionType": "ALWAYS",
            "condition": "",
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
    if (currentDestination.destination.pgpEncrypt.enabled === "true")
    {
        let pgpEncryptPayload = {
			"type": "PgpEncryption",
			"status": "ENABLED",
			"autostart": false,
			"conditionType": "ALWAYS",
			"condition": "",
			"actionOnStepSuccess": "PROCEED",
			"actionOnStepFailure": "FAIL",
			"encryptKeyExpression": currentDestination.destination.pgpEncrypt.key,
			"encryptKeyExpressionType": "ALIAS",
			"encryptKeyOwnerExpression": input.request.account,
			"encryptKeyOwnerExpressionType": "NAME",
			"compressionType": "0",
			"fileFilterExpression": "*",
			"fileFilterExpressionType": "GLOB"
		}
        stDataForAPI.steps.push(pgpEncryptPayload)
    }
    if (currentDestination.destination.requirePassword.enabled === "true")
    {
        let passwordPayload = {
			"type": "Decompress",
			"status": "ENABLED",
			"autostart": false,
			"conditionType": "ALWAYS",
			"condition": "",
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
        case "NYLHosted":{
            let accountPayload = {
                "type": "Publish",
                "status": "ENABLED",
                "conditionType": "ALWAYS",
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
        case "Partnerhosted": {
        let sitePayload = {
          "type": "SendToPartner",
          "status": "ENABLED",
          "autostart": false,
          "conditionType": "ALWAYS",
          "condition": "",
          "fileFilterExpression": "*",
          "fileFilterExpressionType": "GLOB",
          "actionOnStepSuccess": "PROCEED",
          "actionOnStepFailure":"FAIL",
          "transferSiteExpression": `${currentDestination.destination.site}#!#CVD#!#`,
          "transferSiteExpressionType": "LIST",
          "uploadFolder":currentDestination.destination.folder           
        }
            stDataForAPI.steps.push(sitePayload);
                break;
        }
            default : {}
        }
    return stDataForAPI;
    }