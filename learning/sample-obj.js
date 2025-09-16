// let routeObject = {"_id":"650ebaf3abafbca83a4b99c8","requestType":"New","instanceType":"Model","direction":"Inbound","partner":"PART00371","undefined":"Non-PII","externalOwner":{"name":"Hemanth","email":"hemanthkethe@backflipt.com"},"source":{"name":"NYLhosted"},"account":"microsoftOneTwo","currentRoutes":[{"routeName":"Inbound claims processing","clientName":"Xenovus","pgpDecrypt":{"enabled":"true"},"unzip":{"enabled":"false"},"fileDescription":"Route will contain Inbound txt files","fileNamingPattern":"YYYY_Claims.txt","fileNamingExample":"2023_Claims.txt","fileId":"F00012","businessTag":"businessTag","comments":"Comments","destinations":[{"destinationName":"Destination One","destinationType":"TransferAccount","accountName":"Xen_flipt17","folderType":"existingFolder","folder":"/Home/V1","renameFile":{"enabled":"false"},"encodingConversions":{"enabled":"false"},"successDelivery":{"enabled":"false"},"failedDelivery":{"enabled":"false"}}]}],"createdAt":1695464179137,"createdBy":"hemanthkethe@backflipt.com","routeId":"RR00004","status":"Request Claimed","createdByName":"Hemanth Kethe","isDeleted":false,"lastActivityTime":1695465410674,"submittedOn":1695465370140,"claimedBy":"hithesh@backflipt.com","claimedByName":"Hithesh Chowdary","isClaimed":true}

// routeObject.source.cron = "expr";
// routeObject.source.timeInterval = "v1";
// let nestedObject = {"index":[{"name":"Hemanth"},{"name":"Anoop"}]}
// nestedObject.index[1].age = 25;
// console.log(nestedObject)

// //routeIndex
// //destinationIndex
// let routeIndex = input.routeIndex;
// let destinationIndex = input.destinationIndex;
// let routeObject = input.route.currentRoutes;
// if(input.fields.source){
//     let keys = Object.keys(input.fields.source)
//     keys.map((k)=>{
//         routeObject.source[k] = input.fields.source[k];
//     })
// }

// if(input.fields.encodingConversions){
//     routeObject[routeIndex].destinations[destinationIndex].encodingConversions.source = input.fields.encodingConversions.source;
//     routeObject[routeIndex].destinations[destinationIndex].encodingConversions.output = input.fields.encodingConversions.output;
// }
// if(input.fields.pgpDecrypt){
//     routeObject[routeIndex].destinations[destinationIndex].pgpDecrypt.requireSignature = input.fields.pgpDecrypt.requireSignature;

// }
// if (input.fields.renameFile){
//     routeObject[routeIndex].destinations[destinationIndex].renameFile.renameExpression = input.fields.renameFile.renameExpression;

// }

let d =[
    {
        "key": "request",
        "value": {
            "_id": "65257006b0a4a0344393819b",
            "instanceType": "Model",
            "direction": "Inbound",
            "partner": "PART00396",
            "partnerName": "HP",
            "undefined": "Non-PII",
            "externalOwner": {
                "name": "Hewlett Packard",
                "email": "hp@test.com"
            },
            "source": {
                "name": "NYLhosted",
                "folderType": "existingFolder",
                "folderName": "/HPIndiaInvoices"
            },
            "account": "HP-India",
            "currentRoutes": [
                {
                    "routeName": "RouteNHP-Multiple",
                    "clientName": "Microsoft",
                    "pgpDecrypt": {
                        "enabled": "false"
                    },
                    "unzip": {
                        "enabled": "false"
                    },
                    "fileDescription": "claims",
                    "fileNamingPattern": "hp_claims_ddmm.txt",
                    "fileNamingExample": "hp_claims_ddmm.txt",
                    "fileId": "F00039",
                    "idValue": "EFTR00160",
                    "destination": {
                        "destinationName": "Destination2",
                        "destinationType": "InternalSite",
                        "accountName": "BU_Tesla",
                        "remoteSite": {
                            "name": "BU-Tesla-Site1",
                            "server": "localhost",
                            "userName": "BU-Tesla-Site1",
                            "remoteFolder": "/hpmultiple2"
                        },
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
                            "enabled": "false"
                        }
                    }
                }
            ],
            "requestType": "New",
            "createdAt": 1696952326375,
            "createdBy": "nikhiladevathi@backflipt.com",
            "routeId": "RRN00068",
            "status": "Request Claimed",
            "isDeleted": false,
            "createdByName": "Nikhila D",
            "lastActivityTime": 1696952345982,
            "submittedOn": 1696952330906,
            "claimedBy": "hithesh@backflipt.com",
            "claimedByName": "Hithesh Chowdary",
            "isClaimed": true
        }
    },
    {
        "key": "fileDetails",
        "value": {
            "_id": "6516c928abafbca83a58c8ab",
            "partnerId": "PART00396",
            "website": "",
            "description": "",
            "account": "HP-India",
            "clientName": "Microsoft",
            "type": "EFTR",
            "idValue": "EFTR00160",
            "fileDetails": [
                {
                    "environment": "Model",
                    "division": "GBS",
                    "dataSensitivity": "Non-PII",
                    "app": "lbl1000",
                    "appId": "APP-1234",
                    "classifier": "specifications",
                    "fileNamePattern": "specifications.pdf"
                }
            ],
            "createdAt": 1695992104044,
            "createdBy": "nikhiladevathi@backflipt.com",
            "fileId": "F00039",
            "isDeleted": false,
            "partnerName": "HP",
            "lastActivityTime": 1695992104044
        }
    },
    {
        "key": "failureTemplate",
        "value": "RoutingFailedNotification.xhtml"
    },
    {
        "key": "successTemplate",
        "value": "RoutingSucceededNotification.xhtml"
    },
    {
        "key": "routeName",
        "value": "RouteNHP-Multiple"
    },
    {
        "key": "destinationName",
        "value": "Destination1"
    }
]

let rMap={}
d.map((it)=>{rMap[it.key] =it.value})
console.log(JSON.stringify(rMap.request))


let firstMap = {"status":true,"message":"This is error"}
let secondMap ={"status":false}
console.log({...secondMap,...firstMap})