module.exports = (input) => {
    let routeIndex = input.fields.routeIndex;
    let destinationIndex = input.fields.destinationIndex;
    let routeObject = input.route;
    let updateFields = input.fields.updateRoute[routeIndex];
    let destinationFields = updateFields.updateDestination[destinationIndex];
    let updateSourceStatus = updateFields?.isRoutingStarted ?? false;
    //source Files
    if(updateSourceStatus){
    if(updateFields.source){
        let keys = Object.keys(updateFields.source)
        keys.map((k)=>{
            routeObject.source[k] = updateFields.source[k];
        })
    }}
    //encoding
    if(destinationFields?.encodingConversions){
        routeObject.currentRoutes[routeIndex].destinations[destinationIndex].encodingConversions.source = destinationFields?.encodingConversions?.source;
        routeObject.currentRoutes[routeIndex].destinations[destinationIndex].encodingConversions.output = destinationFields?.encodingConversions?.output;
    }
    //renameFile
    if (destinationFields?.renameFile){
        routeObject.currentRoutes[routeIndex].destinations[destinationIndex].renameFile.renameExpression = destinationFields?.renameFile?.renameExpression;
    }
    //pgpDecrypt
    if(updateFields?.pgpDecrypt){
        routeObject.currentRoutes[routeIndex].pgpDecrypt.requireSignature = updateFields?.pgpDecrypt?.requireSignature;
    }
    return routeObject;
    }

    // Inbound: pgpDecrypt,Unzip --> renameFile,encodingConversion
    let l = {
		"updateRoute": [
			{
				"encodingConversions": {
					"source": "UTF-8",
					"output": "X-ORACLE-AR8EBCDICX"
				},
				"updateDestination": [
					{
						"source": {
							"folderType": "existingFolder",
							"folderName": "/NYL-AvancedRoute",
							"schedule": "15"
						}
					},
					{
						"source": {
							"folderType": "",
							"folderName": "",
							"schedule": ""
						}
					}
				]
			}
		],
		"requestId": "RRN00091",
		"routeName": "Source-IS",
		"destinationName": "Destination-PHN-401",
		"fileId": "F00039",
		"routeIndex": 0,
		"destinationIndex": 0,
		"clientName": "Microsoft"
	}