
let request = {"_id":"65257006b0a4a0344393819b","instanceType":"Model","direction":"Inbound","partner":"PART00396","partnerName":"HP","undefined":"Non-PII","externalOwner":{"name":"Hewlett Packard","email":"hp@test.com"},"source":{"name":"NYLhosted","folderType":"newFolder","folderName":"/HPIndiaInvoicesv1"},"account":"HP-India","currentRoutes":[{"routeName":"RouteNHP-Multiple","clientName":"Microsoft","pgpDecrypt":{"enabled":"false"},"unzip":{"enabled":"false"},"fileDescription":"claims","fileNamingPattern":"hp_claims_ddmm.txt","fileNamingExample":"hp_claims_ddmm.txt","fileId":"F00039","idValue":"EFTR00160","destinations":[{"destinationName":"Destination1","destinationType":"TransferAccount","accountName":"nikki1234","folderType":"existingFolder","folder":"/NYL-AvancedRoute","renameFile":{"enabled":"false"},"encodingConversions":{"enabled":"false"},"successDelivery":{"enabled":"false"},"failedDelivery":{"enabled":"false"}},{"destinationName":"Destination2","destinationType":"InternalSite","accountName":"BU_Tesla","remoteSite":{"name":"BU-Tesla-Site1","server":"localhost","userName":"BU-Tesla-Site1","remoteFolder":"/hpmultiple2"},"renameFile":{"enabled":"false"},"encodingConversions":{"enabled":"false"},"successDelivery":{"enabled":"false"},"failedDelivery":{"enabled":"false"}}]}],"requestType":"New","createdAt":1696952326375,"createdBy":"nikhiladevathi@backflipt.com","routeId":"RRN00068","status":"Request Claimed","isDeleted":false,"createdByName":"Nikhila D","lastActivityTime":1696952345982,"submittedOn":1696952330906,"claimedBy":"hithesh@backflipt.com","claimedByName":"Hithesh Chowdary","isClaimed":true}

const finalMap = [];

request.currentRoutes.forEach((route) => {
  route.destinations.forEach((destination) => {
    const newRoute = { ...route }; 
    newRoute.destination = destination;
    delete newRoute.destinations; 
    finalMap.push(newRoute);
  });
});

console.log(finalMap)
let currentDestination = finalMap.find((route)=>route.routeName === "RouteNHP-Multiple" && route.destination.destinationName === "Destination1")
console.log(currentDestination)

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
  //{"stepType":["CharactersReplace","Compress","Decompress","EncodingConversion","ExternalScript","LineEnding","LineFolding","LinePadding","LineTruncating","PgpDecryption","PgpEncryption","Rename","setflowattributes","Publish","PullFromPartner","SendToPartner"]}
    "steps":[]
}
if(input.stepsList.includes('setflowattributes')){
  let attributesList = `fileID=${currentDestination.fileId}\nIDValue=${currentDestination.idValue}\nType=${input.fileInfo.type}\nDivison=${input.fileDetails[0].division}\nData sensitivity=${input.fileDetails[0].dataSensitivty}\nbusinessTag=${currentDestination.businessTag}\ncomments=${currentDestination.comments}`;
  let setFlowAttributesData = {
    "type": "setflowattributes",
    "status": "ENABLED",
    "autostart": false,
    "conditionType": "ALWAYS",
    "condition": "",
    "actionOnStepSuccess": "PROCEED",
    "customProperties": {
      "usePrecedingStepFiles": "true",
      "attributesMode": "add-or-modify",
      "attributesSet": attributesList
    }
  }
  stDataForAPI.push(setFlowAttributesData)
}
if (currentDestination.pgpDecrypt.enabled === "true" && input.stepsList.includes('PgpDecryption'))
{
    let pgpDecrypt = {
        "type": "PgpDecryption",
        "status": "ENABLED",
        "autostart": false,
        "conditionType": "ALWAYS",
        "condition": "",
        "requireTrustedSignature": currentDestination.pgpDecrypt.requireSignature === "true",
        "usePrecedingStepFiles": true,
        "fileFilterExpression": "*",
        "fileFilterExpressionType": "GLOB"
    }
    stDataForAPI.steps.push(pgpDecrypt)
}
if (currentDestination.description.renameFile.enabled === "true" && input.stepsList.includes('Rename')){
    let renameFile = 		{
        "type": "Rename",
        "status": "ENABLED",
        "autostart": false,
        "conditionType": "ALWAYS",
        "condition": "",
        "fileFilterExpression": "*",
        "fileFilterExpressionType": "GLOB",
        "outputFileName":`${currentDestination.destination.renameFile.renameExample}`,
        "usePrecedingStepFiles": true
    }
    stDataForAPI.steps.push(renameFile)
}
if (currentDestination.description.encodingConversions.enabled === "true" && input.stepsList.includes('EncodingConversion')){
    let encodingPayload = 		{
        "type": "EncodingConversion",
        "status": "ENABLED",
        "autostart": false,
        "conditionType": "ALWAYS",
        "condition": "",
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
    case "ApplicationAccount": if(input.stepsList.includes('Publish')){
      {
        let accountPayload =    {
            "type": "Publish",
            "status": "ENABLED",
            "conditionType": "ALWAYS",
            "autostart": false,
            "usePrecedingStepFiles": true,
            "fileFilterExpression": "*",
            "fileFilterExpressionType": "GLOB",
            "filenameCollisionResolutionType": "FAIL",
            "targetAccountExpression": currentDestination.destination.accountName,
            "targetAccountExpressionType": "NAME",
            "targetFolderExpression": currentDestination.destination.folder,
            "targetFolderExpressionType": "SIMPLE"
          }
          stDataForAPI.steps.push(accountPayload);
          break;
    }}
    case "InternalSite": if(input.stepsList.includes('SendToPartner')){
       {
        let sitePayload = {
			"type": "SendToPartner",
			"status": "ENABLED",
			"autostart": false,
			"conditionType": "ALWAYS",
			"condition": "",
			"fileFilterExpression": "*",
			"fileFilterExpressionType": "GLOB",
			"transferSiteExpression": `${currentDestination.destination.sit}#!#CVD#!#`,
			"transferSiteExpressionType": "LIST",
            "uploadFolder":currentDestination.destination.folder           
		}
        stDataForAPI.steps.push(sitePayload);
            break;
    }}
        default : {}
    }
//return stDataForAPI;

let input ={
  request: {
    _id: '65257006b0a4a0344393819b',
    instanceType: 'Model',
    direction: 'Inbound',
    partner: 'PART00396',
    partnerName: 'HP',
    undefined: 'Non-PII',
    externalOwner: { name: 'Hewlett Packard', email: 'hp@test.com' },
    source: {
      name: 'NYLhosted',
      folderType: 'existingFolder',
      folderName: '/HPIndiaInvoices'
    },
    account: 'HP-India',
    currentRoutes: [ [Object] ],
    requestType: 'New',
    createdAt: 1696952326375,
    createdBy: 'nikhiladevathi@backflipt.com',
    routeId: 'RRN00068',
    status: 'Request Claimed',
    isDeleted: false,
    createdByName: 'Nikhila D',
    lastActivityTime: 1696952345982,
    submittedOn: 1696952330906,
    claimedBy: 'hithesh@backflipt.com',
    claimedByName: 'Hithesh Chowdary',
    isClaimed: true
  },
  fileDetails: {
    _id: '6516c928abafbca83a58c8ab',
    partnerId: 'PART00396',
    website: '',
    description: '',
    account: 'HP-India',
    clientName: 'Microsoft',
    type: 'EFTR',
    idValue: 'EFTR00160',
    fileDetails: [ [Object] ],
    createdAt: 1695992104044,
    createdBy: 'nikhiladevathi@backflipt.com',
    fileId: 'F00039',
    isDeleted: false,
    partnerName: 'HP',
    lastActivityTime: 1695992104044
  },
  failureTemplate: 'RoutingFailedNotification.xhtml',
  successTemplate: 'RoutingSucceededNotification.xhtml',
  routeName: 'RouteNHP-Multiple',
  destinationName: 'Destination1'
}