function run(input) {
    try {
    let fileRouteCombinations = JSON.parse(input.fileRouteCombinations);
    input.pageData.currentRoutes = []
    input.pageData.routeDestinations = []
    input.pageData.dropdownAccount = input.pageData.route.direction == "Outbound" ? null : input.pageForm.account
    if(input.pageData.route?.currentRoutes?.length > 1 ){
        input.pageData.route?.currentRoutes.forEach(currentRoute => {
          currentRoute.destinations.forEach(destination => {
            if(input.pageData.referenceId === destination.stRouteId){
              input.pageData.routeDestinations.push(destination)
              input.pageData.currentRoutes.push(currentRoute)
              input.pageData.showRouteDetails = true
            }
          })
      }) 
    }else{
        input.pageData.currentRoutes = input.pageData.route.currentRoutes
        if(input.pageData.currentRoutes[0]?.destinations?.length > 1){
            input.pageData.currentRoutes[0].destinations.forEach(destination => {
                if(input.pageData.referenceId === destination.stRouteId){
                  input.pageData.routeDestinations.push(destination)
                  input.pageData.showRouteDetails = true
                }
              })
        }
        else{
            input.pageData.routeDestinations = input.pageData.route.currentRoutes[0].destinations;
        }
    }
    input.pageData.currentRoute = input.pageData.route;
    input.pageData.isInbound = input.pageData.route.direction === "Inbound";
    input.pageData.isOutbound = input.pageData.route.direction === "Outbound" || "Internal";
    input.pageData.isInternal = input.pageData.route.direction === "Internal";
    if(input.pageData.isInternal){
        input.pageData.sources = fileRouteCombinations.externalSources;
        input.pageData.destinations = fileRouteCombinations.externalSources;
    }
    input.pageData.showAccountDetailsInfo = input.pageData.isOutbound;
    input.pageData.showAccountDetails =  input.pageData.isInbound;
    if(input.pageData.route.direction === "Inbound"){
      input.pageData.sources = fileRouteCombinations.internalSources;
      input.pageData.destinations = fileRouteCombinations.externalSources;
    }
    else {
      input.pageData.sources = fileRouteCombinations.externalSources;
      input.pageData.destinations = fileRouteCombinations.internalSources;
      let source =  input.pageData.route.source.name;
      input.pageData.showApplicationAccount = source === "ApplicationAccount";
      input.pageData.showInternalSite =  source === "InternalSite";
      input.pageData.showTransferAccount = source === "TransferAccount";
      input.pageData.showExistingFolder = input.pageData.route.source.folderType === "existingFolder";
      input.pageData.showNewFolder = input.pageData.route.source.folderType === "newFolder";
      input.pageData.showInternalSite = input.pageData.route.source.name === "InternalSite";
    }
    input.pageData.currentRoutes[0].destinations = input.pageData.routeDestinations;
    input.pageData.destinationAccount = input.pageData.routeDestinations[0].accountName;
    console.log("pageData==>",input.pageData);
    return true;
    } catch (error) {
      console.log(error)
    }
    }