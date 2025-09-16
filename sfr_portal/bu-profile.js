function run(input) {
  try {
    let requests = input.requests.result;
    let currentCount;
    let limit = parseInt(input.limit);
    if (input.showResults == "true") {
      input.pageData.offset = 0;
    }
    if (input.type !== "sort") {
      input.pageData.dataCount = input.requests.count;
    }
    let length = requests?.length || 0;
    if (length === 0 || requests == undefined) {
      input.pageData.isEmpty = true;
      input.pageData.showMore = false;
    } else {

      input.pageData.isEmpty = false;
      if (
        input.pageData.prodKey?.prodEnabled === null ||
        input.pageData.prodKey?.prodEnabled === undefined ||
        input.pageData.prodKey?.prodEnabled === false
      ) {
        // Filter out keys containing "prod" from buFilters
        /*     const filteredBuFilters = input.pageData.buFilters.filter(
          (item) => !item.value.startsWith("prod")
        );
        input.pageData.buFilters = filteredBuFilters;
*/
      }
      currentCount = parseInt(input.pageData.offset) + limit;
      input.pageData.showMore = (currentCount < input.pageData.dataCount);
      let routingStatuses = JSON.parse(input.context.app.config.routingStatuses);
      requests.forEach((request) => {
        request.isOwner = request.createdBy === input.context.principal.userName;
        request.isSubmitted = (request.submittedOn) ? true : false;
        request.format = request.submittedOn ? "DATE" : "";
        request.submittedOn = request.submittedOn || "NA";
        let destinations = []
        request?.currentRoutes?.forEach((route) => {
          destinations.push(route.destinations)
        })
        let isAllRoutesCreated = "" 
        if(request.requestType === "New"){ 
          request.instanceType === input.context.app.config.testInstanceName && destinations.flat().every((dest) => dest.isRouteCreated === true);
        }
        if(request.requestType === "Update"){ 
          (request?.isRouteUpdated) ? true : request?.isRouteUpdated 
          || request?.currentRoutes?.[0]?.destinations?.[0]?.routeProvisonDetails?.updateRoutePackageStatus?.isRoutePackageUpdated 
          || false;
        }
        //request.status === routingStatuses['closed'] &&
        request.isClosed = isAllRoutesCreated;
        if (request?.isRouteCreatedinProd){
            request.isClosed = false;
        }
        request.hideClone = request.requestType === "Update" || request.requestType === "Delete"|| request.instanceType === input.context.app.config.prodInstanceName ? true : false;
      });
      input.pageData.currentRequests = requests;
    }
    return true;
  } catch (error) {
    console.log("ERROR: ", error);
    return false;
  }
}