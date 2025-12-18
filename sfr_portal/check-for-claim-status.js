function getTentativeSiteNames(input){
    try{
    let request = input.request;
    let sites = []
    if (request.direction === 'Outbound'){
        request.currentRoutes.forEach(route => {
            route.destinations.forEach(destination => {
                if (destination.destinationType === 'Partnerhosted')
                    sites.push(destination.remoteSite.name)
            })
        });
    }
    else{
        sites.push(request.source.siteName)
    }
    console.log(sites,"sites")
    const convertedArray = sites.map((site)=>{return {"tentativeSiteName":site}})
    return {"$or":convertedArray}
}
catch(e){
    return {}
}
}
// module.exports = getTentativeSiteNames;

let input = {"request":{"_id":"69425c93c876a378ddccbc53","instanceType":"Model","direction":"Outbound","partner":"PART00127","partnerName":"Comfort","externalOwner":{"name":"a","email":"a@d.com"},"source":{"name":"ApplicationAccount","folderType":"newFolder","folderName":"qwerf"},"clientName":"STC00085","account":"BU_Genpop_BU_DEC","partnerAccount":"Comfort","currentRoutes":[{"routeName":"Route 0","destinations":[{"destinationName":"Destination 0","destinationType":"Partnerhosted","accountName":"Comfort","remoteSite":{"name":"Comfort site_test_1 OBRQ00643 S001","server":"localhost","userName":"user_1","remoteFolder":"folder1","namingPattern":"*"},"pgpEncrypt":{"enabled":"false"},"renameFile":{"enabled":"false"},"successDelivery":{"enabled":"false"},"failedDelivery":{"enabled":"false"}}]}],"requestType":"New","createdAt":1765956754785,"createdBy":"viswanaths@backflipt.com","routeId":"RRN00522","status":"Pending Review","isDeleted":false,"createdByName":"Viswanath S","lastActivityTime":1765956760881,"isIstmEnabled":"false","isApprovalNeeded":"true","isRouteCreatedinProd":false,"eftrNumber":null,"isSubmitted":true,"submittedOn":1765956761007}}

console.log(getTentativeSiteNames(input))