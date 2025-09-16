function SetPageDataAfterFetchingRoute(input) {
  try {
    //to show source account
    input.pageData.showPartnerAccountSource = input.pageData.route.direction === "Inbound";
    input.pageData.showRemoteSite = input.pageData.route.source.name === "Partnerhosted";
    input.pageData.showTransferAccount = input.pageData.route.source.name === "TransferAccount";
    input.pageData.showApplicationAccount = input.pageData.route.source.name === "ApplicationAccount";
    input.pageData.showInternalSite = input.pageData.route.source.name === "InternalSite";
    if (input.pageData.currentRoutes.length) {
      input.pageData.currentRoutes.forEach((route) => {
        route.showDescription = true;
        route.showFileId = true;
        route.showFileIdDetails = true;
        route.preDeliveryDetails = true;
        route.showAddDestination = true;
        route.showRenameExample = input.pageData.route.direction === "Outbound" && route.renameFile.enabled === "true";
        route.renameEnable = route.showRenameExample;
        route.showCron = input.pageData.route.source.schedule === "cron";
        route.fileIds = input.pageData.fileIds;
        fileIDInfo = route.fileIds.result.filter((fileId) => {
          return fileId.fileId === route.fileId;
        });
        route.fileIDInfo = fileIDInfo[0];
        route.destinations.forEach((destination) => {
          if (route.destinations.length) {
            //Rename Folder
            let fieldParam = input.pageData.currentRoutes[0].destinations[0].renameFile?.enabled;
            if (fieldParam) {
              input.pageData.currentRoutes[0].destinations[0].showEncoding = true;
              input.pageData.currentRoutes[0].destinations[0].showRenamingEx = fieldParam === "true";
            } 
            else {
              input.pageData.currentRoutes[0].destinations[0].showEncoding = false;
            }
            //Encoding conversion
            fieldParam = input.pageData.currentRoutes[0].destinations[0].encodingConversions?.enabled;
            if (fieldParam) {
              input.pageData.currentRoutes[0].destinations[0].showNotification = true;
            } else {
              input.pageData.currentRoutes[0].destinations[0].showNotification = false;
            }
            //For IT Admin actions
            if (input.pageData.isInbound) {
              route.requireSignature = route.pgpDecrypt.enabled === "true";
              route.requireSubscription =
                input.pageData.isInbound &&
                input.pageData.route.source.name == "NYLhosted";
              route.requireSite =
                input.pageData.isInbound &&
                input.pageData.route.source.name == "Partnerhosted";
              destination.renameEnable =
                destination.renameFile.enabled === "true";
              destination.encodingEnable =
                destination.encodingConversions?.enabled === "true";
              route.shownFolder =
                input.pageData.route.source?.folderType === "newFolder";
              route.showeFolder =
                input.pageData.route.source?.folderType === "existingFolder";
              input.pageData.showFolderSelection = true;
              if (destination.folderType === "existingFolder") {
                destination.folders = input.pageData.accountSubscriptions;
              }
              destination.noActionRequired =
                destination.renameEnable === false &&
                destination.encodingEnable === false;
              destination.destinationType === "InternalSite"
                ? (destination.destinationSites = input.pageData?.acountFolders
                    ?.filter(
                      (info) =>
                        info.accountName === destination.accountName &&
                        info.type === "sites"
                    )
                    ?.at(0)?.result)
                : [];
            } else {
              route.renameEnabled = route.renameFile.enabled === "true";
              route.encodingEnable =
                route.encodingConversions?.enabled === "true";
              route.requireSite =
                input.pageData.route.source.name === "InternalSite";
              route.requireSubscription =
                input.pageData.isOutbound &&
                destination.destinationType == "InternalSite";
              destination.requireSubscription =
                input.pageData.isInbound &&
                destination.destinationType == "NYLhosted";
              destination.requireSite =
                input.pageData.isOutbound &&
                destination.destinationType == "Partnerhosted";
              destination.requireRemoteSite =
                input.pageData.route.source.name == "InternalSite";
              input.pageData.showFolderSelection =
                input.pageData.isOutbound &&
                input.pageData.route.source.name === "InternalSite";
              route.shownFolder =
                input.pageData.route.source.name === "InternalSite" &&
                input.pageData.route.source?.folderType === "newFolder";
              route.showeFolder =
                input.pageData.route.source.name === "InternalSite" &&
                input.pageData.route.source?.folderType === "existingFolder";
              destination.showFolderIT =
                input.pageData.route.source?.folderType === "newFolder";
              if (destination.destinationType === "Partnerhosted") {
                destination.folderType = "existingFolder";
                destination.folder = destination.remoteSite.remoteFolder;
              }
              if (destination.pgpEncrypt.enabled) {
                destination.pgpFiles = input.pageData.certificates;
              }
              destination.destinationType === "Partnerhosted"
                ? (destination.destinationSites = input.pageData?.acountFolders
                    ?.filter(
                      (info) =>
                        info.accountName === destination.accountName &&
                        info.type === "sites"
                    )
                    ?.at(0)?.result)
                : [];
              destination.noActionRequired = true;
              //nopreRoutingRequired
              route.nopreRoutingRequired =
                route.renameEnabled === false && route.encodingEnable === false;
            }
            selectedSite =
              destination.remoteSite &&
              destination.remoteSite.name &&
              input.pageData.partnerTransferSites.filter(
                (site) => site.name === destination.remoteSite.name
              );
            destination.selectedSite = (selectedSite && selectedSite[0]) || {};
            destination.selectedSite.server =
              selectedSite && destination.selectedSite.host;
            destination.isInbound = !input.pageData.isInbound;
            destination.isOutbound = !input.pageData.isOutbound;
            route.showFileDestination = true;
            destination.accountInfo =
              destination.accountName &&
              input.pageData.partnerAccounts.filter(
                (partner) => partner.accountName === destination.accountName
              );
            destination.showNewFolder = destination.folderType === "newFolder";
            destination.showExistingFolder =
              destination.folderType === "existingFolder";
            destination.showNewFolderAppAccount =
              destination.folderType === "newFolder" &&
              destination.destinationType === "ApplicationAccount";
            destination.showExistingFolderAppAccount =
              destination.folderType === "existingFolder" &&
              destination.destinationType === "ApplicationAccount";
            destination.showRenamingEx =
              input.pageData.route.direction === "Inbound" &&
              destination.renameFile.enabled === "true";
            destination.showPGP =
              input.pageData.route.direction === "Outbound" &&
              destination.pgpEncrypt.enabled === "true";
            destination.showPassword =
              input.pageData.route.direction === "Outbound" &&
              destination?.requirePassword?.enabled === "true";
            destination.showSuccessEmails =
              destination.successDelivery.enabled === "true";
            destination.showEmails =
              destination.failedDelivery.enabled === "true";
            destination.showTransferAccount =
              destination.destinationType === "TransferAccount";
            destination.showInternalSite =
              destination.destinationType === "InternalSite";
            destination.showApplicationAccount =
              destination.destinationType === "ApplicationAccount";
            destination.showRemoteSite =
              input.pageData.isOutbound &&
              destination.destinationType === "Partnerhosted";
          }
        });
      });
    }

    console.log(input.pageData);
    return true;
  } catch (error) {
    console.log(error);
  }
}
