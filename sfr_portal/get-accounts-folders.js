let route ={
    "_id": "6527fcafb0a4a034439e8be9",
    "instanceType": "Model",
    "direction": "Inbound",
    "partner": "PART00380",
    "partnerName": "Tesla",
    "externalOwner": {
        "name": "ext_p",
        "email": "ext_p@backflipt.com"
    },
    "source": {
        "name": "NYLhosted"
    },
    "account": "james100",
    "currentRoutes": [
        {
            "routeName": "Route 0",
            "clientName": "james-tesla",
            "pgpDecrypt": {
                "enabled": "false"
            },
            "unzip": {
                "enabled": "false"
            },
            "fileDescription": "fileDescription",
            "fileNamingPattern": "fileNamingPattern",
            "fileNamingExample": "fileNameExample",
            "fileId": "F00044",
            "idValue": "EFTR00157",
            "businessTag": "businessTag",
            "comments": "Comments",
            "destinations": [
                {
                    "destinationName": "Destination 1",
                    "destinationType": "TransferAccount",
                    "accountName": "Xen_flipt17",
                    "folderType": "existingFolder",
                    "folder": "/Home/V1",
                    "renameFile": {
                        "enabled": "false"
                    },
                    "encodingConversions": {
                        "enabled": "false"
                    },
                    "successDelivery": {
                        "enabled": "false"
                    },
                    "failedDelivery": {
                        "enabled": "true",
                        "emails": "f1@gmail.com"
                    },
                    "renameEnable": false,
                    "encodingEnable": false,
                    "isInbound": false,
                    "isOutbound": true,
                    "accountInfo": [],
                    "showNewFolder": false,
                    "showExistingFolder": true,
                    "showRenamingEx": false,
                    "showPGP": false,
                    "showPassword": false,
                    "showSuccessEmails": false,
                    "showEmails": true,
                    "showTransferAccount": true,
                    "showInternalSite": false,
                    "showApplicationAccount": false,
                    "showRemoteSite": false
                }
            ],
            "showDescription": true,
            "showFileId": true,
            "showFileIdDetails": true,
            "preDeliveryDetails": true,
            "showAddDestination": true,
            "showRenameExample": false,
            "renameEnable": false,
            "fileIDInfo": {
                "_id": "6516d34eabafbca83a5950d0",
                "clientName": "james-tesla",
                "type": "EFTR",
                "idValue": "EFTR00157",
                "fileDetails": [
                    {
                        "environment": "Model",
                        "division": "GBS",
                        "dataSensitivity": "PII",
                        "app": "LBL1000",
                        "appId": "APP-1234",
                        "classifier": "1",
                        "fileNamePattern": "1"
                    },
                    {
                        "environment": "Model",
                        "division": "NYL",
                        "dataSensitivity": "Non-PII",
                        "app": "LBL1000",
                        "appId": "APP-1234",
                        "classifier": "2",
                        "fileNamePattern": "2"
                    }
                ],
                "fileId": "F00044",
                "partnerName": "Tesla",
                "label": "F00044",
                "value": "F00044"
            },
            "requireSignature": false,
            "requireSubscription": true,
            "requireSite": false,
            "shownFolder": false,
            "showeFolder": false,
            "showFileDestination": true
        }
    ],
    "requestType": "New",
    "createdAt": 1697119407631,
    "createdBy": "hemanthkethe@backflipt.com",
    "routeId": "RRN00145",
    "status": "Request Created",
    "isDeleted": false,
    "createdByName": "Hemanth Kethe",
    "lastActivityTime": 1697119407631,
    "isIstmEnabled": "true",
    "isApprovalNeeded": "true"
}

let accountNames = [];
if(input.route.source?.folderType === "existingFolder"){
    accountNames.push({"type":"folder","accountName":input.route.account})
}
input.route.currentRoutes.map((route)=>{
    route.destinations.map((destination)=>{
        if(destination.folderType === "existingFolder"){
            let accountName = destination?.accountName;
            accountNames.push({"type":"folder","accountName":accountName})    
        }
        if(destination.pgpEncrypt.enabled === "true"){
            accountNames.push({"type":"pgp","accountName":input.route.account})
        }
        if(destination?.destinationType === "Partnerhosted"){
            accountNames.push({"type":"sites","accountName":accountName})
        }
    })
})
return accountNames;