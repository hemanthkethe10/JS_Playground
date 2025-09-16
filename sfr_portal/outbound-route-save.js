function run(input) {
    let routeIndex = input.fields.routeIndex || 0;
    let destinationIndex = input.fields.destinationIndex || 0;
    let routeObject = input.route;
    let updateFields = input.fields.updateRoute?.at(routeIndex);
    let destinationFields = updateFields?.updateDestination?.at(destinationIndex);
    let updateSourceStatus = updateFields?.isRoutingStarted ?? false;
    //source Files
    if(!updateSourceStatus){
    if(updateFields?.source){
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
    let input = {
            "route": {
                "_id": "6527d72db0a4a034439c8ea5",
                "instanceType": "Model",
                "direction": "Outbound",
                "partner": "PART00396",
                "partnerName": "HP",
                "externalOwner": {
                    "name": "hp",
                    "email": "hp@test.com"
                },
                "source": {
                    "name": "InternalSite",
                    "siteName": "BU-Tesla-Site1",
                    "server": "localhost",
                    "userName": "BU-Tesla-Site1",
                    "remoteFolder": "/hp/outbound-is-401"
                },
                "account": "BU_Tesla",
                "currentRoutes": [
                    {
                        "routeName": "Source-IS",
                        "clientName": "Microsoft",
                        "fileDescription": "Devices List",
                        "fileNamingPattern": "hp_devices_list_MMDDYY.pdf",
                        "fileNamingExample": "hp_devices_list_102323.pdf",
                        "fileId": "F00039",
                        "idValue": "EFTR00160",
                        "renameFile": {
                            "enabled": "false"
                        },
                        "encodingConversions": {
                            "enabled": "false"
                        },
                        "destinations": [
                            {
                                "destinationName": "Destination-PHN-401",
                                "destinationType": "Partnerhosted",
                                "accountName": "HP-India",
                                "folderType": "existingFolder",
                                "folder": "/HPIndiaInvoices",
                                "remoteSite": {
                                    "name": "HP-India-PartnerSite1",
                                    "server": "localhost",
                                    "userName": "hpindia",
                                    "remoteFolder": "/hp/PHN-402",
                                    "namingPattern": "hp_devices_list_MMDDYY.pdf"
                                },
                                "pgpEncrypt": {
                                    "enabled": "false"
                                },
                                "requirePassword": {
                                    "enabled": "false"
                                },
                                "successDelivery": {
                                    "enabled": "false"
                                },
                                "failedDelivery": {
                                    "enabled": "false"
                                }
                            },
                            {
                                "destinationName": "Destination-NHP-401",
                                "destinationType": "NYLhosted",
                                "accountName": "HP-India",
                                "folderType": "existingFolder",
                                "folder": "/HPIndiaInvoices",
                                "pgpEncrypt": {
                                    "enabled": "false"
                                },
                                "requirePassword": {
                                    "enabled": "false"
                                },
                                "successDelivery": {
                                    "enabled": "false"
                                },
                                "failedDelivery": {
                                    "enabled": "false"
                                }
                            }
                        ]
                    }
                ],
                "requestType": "New",
                "createdAt": 1697109805683,
                "createdBy": "nikhiladevathi@backflipt.com",
                "routeId": "RRN00124",
                "status": "Request Claimed",
                "isDeleted": false,
                "createdByName": "Nikhila D",
                "lastActivityTime": 1697109985857,
                "isIstmEnabled": "true",
                "isApprovalNeeded": "true",
                "eftrNumber": "EFTR00160",
                "isSubmitted": true,
                "snowInfo": {
                    "ritmNumber": "RITM0010714",
                    "actionTime": 1697109945342,
                    "status": "Approved",
                    "taskComments": "Task Created for the RITM:RITM0010714",
                    "taskNumber": "SCTASK0010707"
                },
                "submittedOn": 1697109813719,
                "claimedBy": "hithesh@backflipt.com",
                "claimedByName": "Hithesh Chowdary",
                "isClaimed": true
            },
            "fields": {
                "updateRoute": [
                    {
                        "source": {
                            "folderType": "existingFolder",
                            "folderName": "/NYL-AvancedRoute",
                            "schedule": "180"
                        },
                        "updateDestination": [
                            null,
                            {
                                "folderUpdates": {
                                    "folderType": "existingFolder",
                                    "folderName": "/HPIndiaInvoices"
                                }
                            }
                        ]
                    }
                ],
                "requestId": "RRN00124",
                "routeName": "Source-IS",
                "destinationName": "Destination-PHN-401",
                "fileId": "F00039",
                "routeIndex": 0,
                "destinationIndex": 0,
                "clientName": "Microsoft"
            }
        }
console.log(run(input))
    //Outbound: renameFile,encoding --> encrypt,passwordProtected
