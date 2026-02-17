 function formRoutePayload(input) {
  try {
      input.pageData.showInstance = true;
      input.pageData.showDirection = input.pageData.route.resourceType !== "Legacy"; //true;
      input.pageData.showPartner = true;
      input.pageData.checkBox= {"true": true, "false":false};
      input.pageData.showPartnerDetails = true;
      input.pageData.showPADetails = true;
      input.pageData.showLegacy = false;
      input.pageData.prodEnabled = input.pageData.route?.instanceType === input.context.prodInstanceName;
      input.pageData.hideEncodingOptions = input.context.hideEncoding === "true";
      input.pageData.hideFileIdOption = input.context.hideFileId === "true";
      input.pageData.collisionResolution = JSON.parse(input?.context?.collisionResolutionType || '{}');
      input.pageData.postClientDownloads = JSON.parse(input?.context?.postClientDownload ||'{}');
      input.pageData.postRouteSettings = JSON.parse(input?.context?.postRouteSetting ||'{}');
      input.pageData.showClient = input.pageData.hideFileIdOption ? false : true;
      input.pageData.moved = input.pageData.route.source?.postRouteSettings?.onSuccessPostRoutingSettings === "moved";
      input.pageData.move = input.pageData.route.source?.postRouteSettings?.onFailurePostRoutingSettings === "move"
      input.pageData.enableEncoding = input.context?.hideFileId === 'true' ? false :  input.pageData.isInbound;
      input.pageData.showPartnerAccountSource = input.pageData.route.direction === "Inbound"; 
      //update routing request view
      let resetRITM = input?.type ==='prod' || input.pageData.route.instanceType === input.context.prodInstanceName;
      if(resetRITM){
          //disable ITSM for cloneToProd
          input.pageData.route.isIstmEnabled = 'false'
          input.pageData.route.isApprovalNeeded = 'false';
      }
      input.pageData.clientName = input.pageData.route?.clientName;
      input.pageData.useExistingFileID = (input?.type === 'prod' && !input.pageData.hideFileIdOption) ? true :input.pageData.route?.existingFileID?.enabled === "true";
      (input?.type === 'prod' && !input.pageData.hideFileIdOption) ? input.pageData.route.existingFileID.enabled = 'true' : '';
      input.pageData.hideIDValueOther = input.pageData.route?.existingFileID?.type === "eftr";
      input.pageData.hideIDValueEftr = !input.pageData.hideIDValueOther;
      input.pageData.hideNewClient = input.pageData.route?.existingFileID?.clientName === "Add New Client";
      input.pageData.directionList = JSON.parse(input?.context?.directionsList || '{}');
      input.pageData.fileType = JSON.parse(input?.context?.fileType || {});
      input.pageData.fileDetailsDivision = JSON.parse(input?.context?.fileDetailsDivision || {});
      input.pageData.fileDetailsDataSensitivity = JSON.parse(input?.context?.fileDetailsDataSensitivity || {});
      //For success messages
      input.pageData.showNew = input.pageData.route.requestType === "New";
      if (input.pageData.route.requestType !== "New") {
          input.pageData.showUpdate = input.pageData.route.requestType === "Update";
          if (input.pageData.route.requestType === "Update" && input.pageData.route.resourceType === "Legacy") {
              input.pageData.showLegacy = true;
              input.pageData.showUpdate = false;
          }
      }
      input.pageData.showDelete = input.pageData.route.requestType === "Delete";
      if (input.pageData?.route?.existingFileID?.enabled === "true") {
          input.pageData.route.existingFileID.clientName = input.pageData.route?.clientName;
      }
      //For BU view page grey containers
      input.pageData.closeRequest = input.pageData.route?.currentRoutes?.every((route) => route?.destinations?.every((dest) => dest.isRouteCreated === true));
      //Set the keys needed for IT Edit
      if (input.editingUserType === "IT") {
          input.pageData.closeRequest = input.pageData.route?.currentRoutes?.every((route) => route?.destinations?.every((dest) => dest.isRouteCreated === true));
          input.pageData.notifyBusinessUserTest = input.pageData.route.status === "Closed";
          input.pageData.showRouteprogress = input.pageData.route?.isRoutingStarted ?? false;
          // Added this case after hideFileId is added
          input.pageData.hideClassifier = input.context?.hideFileId === 'true' ? true :  !input.pageData.useExistingFileID;
      }
      //For update and delete Unhide grey container
      if (input.pageData.route.requestType === "Update" || input.pageData.route.requestType === "Delete") {
          input.pageData.closeRequest = true;
      }
      input.pageData.partnerAccount = input.pageData.route.partnerAccount;
      input.pageData.account = input.pageData.route.account;
      input.pageData.clients = input.pageData.partnerInfo.clients;
      //For FileId hide option
      if (input.pageData.hideFileIdOption){
          let clients = input.pageData.partnerInfo.clients;
          clients.splice(0, 0, {
              "label": "Add New Client",
              "value": "Add New Client"
          });
          input.pageData.clients = clients;
      }
      //Normal FileId handling
      if ((input.pageProps.sourceId && !input.pageData.useExistingFileID && !input.pageData.hideFileIdOption) || input.pageData.hideNewClient) {
          let clients = input.pageData.partnerInfo.clients;
          input.pageData.route.existingFileID.clientName = input.pageData.route.clientName;
          clients.splice(0, 0, {
              "label": "Add New Client",
              "value": "Add New Client"
          });
          input.pageData.clients = clients;
      }
      input.pageData.isInbound = input.pageData.route.direction === "Inbound";
      input.pageData.isOutbound = input.pageData.route.direction === "Outbound" || input.pageData.route.direction === "Internal";
      input.pageData.isInternal = input.pageData.route.direction === "Internal";
      input.pageData.showAccountDetailsInfo = input.pageData.isInbound;
      input.pageData.showInternalSite = input.pageData.route?.source?.name === "InternalSite";
      input.pageData.showAccountDetails = input.pageData.isInbound;
      input.pageData.siteDetails = input.pageData.showInternalSite && input.pageData.isOutbound;
      input.pageData.partnerAccounts = input.pageData.partnerInfo.accounts;
      input.pageData.partnerAccounts.forEach((account) => {
          account.value = account.accountName;
          account.label = account.accountName
      })
      let fileRouteCombinations = JSON.parse(input?.context?.fileRouteCombinations || '{}');
      let destinationAndSourcesMap = {
          "sources": fileRouteCombinations.internalSources,
          "destinations": fileRouteCombinations.externalSources
      }
      input.pageData.sources = (input.pageData.route.direction === "Inbound") ? destinationAndSourcesMap.sources : (input.pageData.route.direction === "Internal") ? destinationAndSourcesMap.destinations : destinationAndSourcesMap.destinations;
      input.pageData.destinations = (input.pageData.route.direction === "Inbound") ? destinationAndSourcesMap.destinations : (input.pageData.route.direction === "Internal") ? destinationAndSourcesMap.destinations : destinationAndSourcesMap.sources;
      input.pageData.accountInfo = input.pageData.partnerAccounts.filter((partner) => partner.value === input.pageData.route.partnerAccount);
      if (input.pageData.isOutbound) {
          let source = input.pageData.route.source.name;
          input.pageData.showApplicationAccount = source === "ApplicationAccount";
          input.pageData.showInternalSite = source === "InternalSite";
          input.pageData.showTransferAccount = source === "TransferAccount";
          input.pageData.showExistingFolder = input.pageData.route.source.folderType === "existingFolder";
          input.pageData.showNewFolder = input.pageData.route.source.folderType === "newFolder";
          input.pageData.showISAccount = input.pageData.showInternalSite;
          input.pageData.showISSite = input.pageData.showISAccount;
          input.pageData.showPA = true;
      }
      if (input.pageData.route.direction === "Inbound") {
          let partnerTransferSites = input.pageData?.acountFolders?.filter((info) => info.accountName === input.pageData.route.account && info.type == "sites")?.at(0)?.result;
          input.pageData.partnerTransferSites = partnerTransferSites;
          input.pageData.selectedSite = (input.pageData.route?.source?.siteName) && partnerTransferSites?.filter((site) => site.name === input.pageData.route.source.siteName)?.at(0);
          input.pageData.showAccountDetailsSite = !!(input.pageData.route.source.siteName);
          input.pageData.showAccountDetailsSiteSsh = input.pageData.showAccountDetailsSite && input.pageData.selectedSite?.type === 'ssh'
          input.pageData.showFilePatternSite = input.pageData.showAccountDetailsSite;
          input.pageData.showPA = false;
      } else {
          let routeSites = input.pageData?.acountFolders?.filter((info) => info.accountName === input.pageData.route.account && info.type == "sites");
          input.pageData.buInternalSites = routeSites?.at(0)?.result;
          input.pageData.selectedSite = (input.pageData.route?.source?.siteName) && routeSites?.at(0)?.result?.filter((site) => site.name === input.pageData.route.source.siteName)?.at(0);
      }
      input.pageData.siteDetailsSsh = input.pageData.siteDetails && input.pageData.selectedSite?.type === 'ssh';
      input.pageData.fileIds = input.pageData.fileIds.result;
      input.pageData.showRemoteSite = input.pageData.route?.source?.name === "Partnerhosted";
      if (input.pageData.route?.currentRoutes?.length) {
          input.pageData.route?.currentRoutes.forEach((route) => {

            
              //sourceFolders
              if (input.pageData.route.source?.folderType === "existingFolder") {
                  let sourceFolders = input.pageData?.acountFolders?.filter((info) => info.accountName === input.pageData.route.account);
                  input.pageData.sourceFolders = sourceFolders?.at(0)?.result;
                  route.itFolders = sourceFolders?.at(0)?.result;
              }


              route.showDescription = true;
              route.showFileIdDetails = true;
              route.preDeliveryDetails = true;
              route.showCron = input.pageData.route?.source?.schedule === "cron";
              //route.showRenameExample = (input.pageData.isOutbound) && (destination.renameFile.enabled === "true");
              if (input.pageData.useExistingFileID || input.pageData.route.requestType != "New") {
                  let fileInfoAfterSplit = route?.fileId?.split('-') || [];
                  let fileId = (fileInfoAfterSplit.length >= 2) ? fileInfoAfterSplit[0] : route.fileId || input.pageData.route.fileId;
                  let classifier = (fileInfoAfterSplit.length >= 2) ? fileInfoAfterSplit[1] : route.classifierIndex;
                  let fileIDInfo = (fileId && classifier) ? input.pageData.fileIds.find((it) => it.fileId === fileId && it.fileDetailIndex === classifier) : input.pageData.fileIds.find((it) => it.fileId === route.fileId);
                  if (fileIDInfo !== undefined) {
                      route.fileIDInfo = fileIDInfo;
                  }

              } else {
                  //For Existing FILE Id ---> NO
                  route.showFileIdDetails = false;
                  let fileId = input.pageData.route?.fileId;
                  let classifier = route.classifierIndex || "FD00001";
                  let fileIDInfo = (fileId && classifier) ? input.pageData?.fileIds.find((it) => it.fileId === fileId && it.fileDetailIndex === classifier) : input.pageData.fileIds.find((it) => it.fileId === route.fileId);
                  if (fileIDInfo !== undefined) {
                      route.fileIDInfo = fileIDInfo;
                  }

              }
              route.triggerPattern = route?.triggerPattern || route.fileNamingPattern;
              //Show Transmission Settings
              route.showTransmissionSettings = input.pageData.route?.source?.folderType === 'newFolder';
              route?.destinations?.forEach((destination) => {
                  if (route?.destinations.length) {
             
                      //For IT Admin actions
                      if (input.editingUserType === "IT") {
                          route.isRoutingStarted = route?.destinations.some((dest) => dest?.isRouteCreated === true)
                       if (destination && !destination.collisionSettings) {
                             destination.collisionSettings={filenameCollisionResolutionType : "OVERWRITE"};
                               }
                          if (input.pageData.isInbound) {
                              destination.collision = (destination.destinationType === "ApplicationAccount"||destination.destinationType==="TransferAccount");
                             if (destination.destinationType === "InternalSite"){
                                destination.sendToPartner = true;
                                destination.retrySettings ??= {};
                                destination.retrySettings.maxNumberOfRetries ??= 5;
                                destination.retrySettings.sleepBetweenRetries ??= 3000;
                                destination.retrySettings.sleepIncrementBetweenRetries ??= 2000;
                              }
                              route.requireSignature = route.pgpDecrypt.enabled === "true";
                              input.pageData.showFolderSelection = true;
                              input.pageData.hideFolderSelection = false;
                              route.requireSite = input.pageData.route.source.name === "Partnerhosted";destination.renameEnable = destination?.renameFile?.enabled === "true";
                              destination.encodingEnable = destination?.encodingConversions?.enabled === "true";
                              route.shownFolder = input.pageData.route?.source?.folderType === "newFolder";
                              route.shownSubscription = input.pageData.route?.source?.folderType === "newFolder";
                              route.showeFolder = input.pageData.route?.source?.folderType === "existingFolder";
                              destination.noActionRequired = destination.renameEnable === false && destination.encodingEnable === false;
                          } else {
                             //Outbound case
                              if(destination.destinationType === "Partnerhosted" || destination.destinationType === "InternalSite"){
                                destination.sendToPartner = true;
                                destination.retrySettings ??= {};
                                destination.retrySettings.maxNumberOfRetries ??= 5;
                                destination.retrySettings.sleepBetweenRetries ??= 3000;
                                destination.retrySettings.sleepIncrementBetweenRetries ??= 2000;
                              };
                              destination.renameEnable = destination?.renameFile?.enabled === "true";
                              route.encodingEnable = route?.encodingConversions?.enabled === "true";
                              //destination subscription
                              destination.requireSubscription = input.pageData.isOutbound && destination.destinationType === "clientHosted";
                              //collison settings
                                destination.collision = (input.pageData.isInternal && (destination.destinationType === "ApplicationAccount" || destination.destinationType === "TransferAccount")) || (input.pageData.isOutbound && destination.destinationType === "clientHosted");

                              //destination.noActionRequired = true;
                              destination.noActionRequired = destination.renameEnable === false;
                              route.requireSite = input.pageData.route?.source?.name === "InternalSite";
                              
                              //show Folder selection
                              // input.pageData.showFolderSelection = input.pageData.route?.source?.name === "InternalSite";
                              input.pageData.showFolderSelection = true;
                              input.pageData.hideFolderSelection = !(input.pageData.route?.source?.name === "InternalSite");
                              //destination.requireRemoteSite = input.pageData.route.source.name =="InternalSite";
                              destination.showFolderIT = input.pageData.route?.source?.folderType === "newFolder";
                              //Outbound and Internal Site
                              route.shownFolder = input.pageData.route?.source?.name === "InternalSite" && input.pageData.route?.source?.folderType === "newFolder";
                              route.showeFolder = input.pageData.route?.source?.name === "InternalSite" && input.pageData.route?.source?.folderType === "existingFolder";
                              //nopreRoutingRequired
                              //route.nopreRoutingRequired = destination.renameEnable === false && route.encodingEnable === false;
                              route.nopreRoutingRequired = route.encodingEnable === false;
                          }
                      }
                      //folders
                      if (destination?.folderType === "existingFolder") {
                          let destinationFolders = input.pageData?.acountFolders?.filter((info) => info.accountName === destination.accountName && info.type === "folder")
                          destination.folders = destinationFolders?.at(0)?.result;
                      }
                      destination.downloadFileName = (destination?.pgpEncrypt?.enabled === "true") ? destination.pgpEncrypt?.key?.fileName : ""
                      if (destination.pgpEncrypt?.enabled === "true") {
                          destination.showPGP = true;
                          destination.isUploaded = true;
                          input.pageData.isUploadedPGPKeyTest = true;
                      } else {
                          destination.showPGP = false;
                          destination.isUploaded = false;
                      }

                      if (input.pageData.isInbound) {
                          let sites = input.pageData?.acountFolders?.filter((info) => info.accountName === destination?.accountName && info.type == "sites");
                          destination.selectedSite = (destination.remoteSite) && (destination.remoteSite.name) && sites?.at(0)?.result.filter((site) => site.name === destination.remoteSite.name)?.at(0);
                          //Hide servername and port
                          destination.showISDetails = destination.selectedSite?.type === 'ssh';
                          (destination.destinationType === "InternalSite") ? destination.destinationSites = input.pageData?.acountFolders?.filter((info) => info.accountName === destination.accountName && info.type === "sites")?.at(0)?.result: [];
                          (destination.destinationType === "InternalSite") ? destination.destinationSites = sites?.at(0)?.result || []: "";
                          route.shownFolder = input.pageData.route?.source?.folderType === "newFolder";
                          route.showeFolder = input.pageData.route?.source?.folderType === "existingFolder";
                          //destination.showISDetails = destination.destinationType === "InternalSite";
                      } else {
                          let sites = input.pageData?.acountFolders?.filter((info) => info.accountName === destination?.accountName && info.type == "sites");
                          destination.selectedSite = (destination.remoteSite) && (destination.remoteSite.name) && sites?.at(0)?.result.filter((site) => site.name === destination.remoteSite.name)?.at(0);
                          //Hide servername and port
                          destination.showISDetails = destination.selectedSite?.type === 'ssh';
                          (destination.destinationType === "Partnerhosted" || "InternalSite") ? destination.destinationSites = input.pageData?.acountFolders?.filter((info) => info.accountName === destination.accountName && info.type === "sites")?.at(0)?.result: [];
                          destination.pgpFiles = (destination.pgpEncrypt.enabled === "true") ? input.pageData?.acountFolders?.filter((info) => info.accountName === input.pageData.route.account && info.type === "pgp")?.at(0).result : [];
                          route.shownFolder = (input.pageData.route?.source?.name === "InternalSite") && (input.pageData.route?.source?.folderType === "newFolder");
                          route.showeFolder = (input.pageData.route?.source?.name === "InternalSite") && (input.pageData.route?.source?.folderType === "existingFolder");
                          //destination.showISDetails = destination.destinationType === "InternalSite" || "PartnerHosted";
                      }
                      destination.isInbound = JSON.stringify(input.pageData.sources) === JSON.stringify(input.pageData.destinations) ? input.pageData.isInbound : !input.pageData.isInbound;
                      destination.isOutbound = JSON.stringify(input.pageData.sources) === JSON.stringify(input.pageData.destinations) ? input.pageData.isOutbound : !input.pageData.isOutbound
                      route.showFileDestination = true;
                      destination.showNHA = destination.destinationType === "clientHosted";
                      destination.showExistingFolder = destination.folderType === "existingFolder";
                      destination.showNewFolder = destination.folderType === "newFolder";
                      // destination.showRenamingEx = (input.pageData.isInbound) && destination.renameFile.enabled === "true";
                      destination.showRenamingEx = destination?.renameFile?.enabled === "true";
                      destination.showPGP = (input.pageData.isOutbound) && destination.pgpEncrypt.enabled === "true";
                      destination.showPassword = (input.pageData.isOutbound) && destination?.requirePassword?.enabled === "true";
                      destination.showSuccessEmails = destination.successDelivery.enabled === "true";
                      destination.showEmails = destination.failedDelivery.enabled === "true";
                      destination.showTransferAccount = destination.destinationType === "TransferAccount";
                      destination.showInternalSite = destination.destinationType === "InternalSite";
                      destination.showApplicationAccount = destination.destinationType === "ApplicationAccount";
                      destination.showNewFolderAppAccount = (destination.showApplicationAccount) && (destination.folderType === "newFolder");
                      destination.showExistingFolderAppAccount = (destination.showApplicationAccount) && (destination.folderType === "existingFolder");
                      destination.showRemoteSite = (input.pageData.isOutbound) && destination.destinationType === "Partnerhosted";
                      destination.showSiteDetails = destination.showRemoteSite && destination.selectedSite?.type === 'ssh';
                  }
                  input.pageData.routeProvisonDetails = {
                      "isSubscriptionCreated": {},
                      "isSubscriptionUpdated": {},
                      "isRouteCreated": {},
                      "isRouteUpdated": {},
                      "inboundRoutePackageCreated": {},
                      "outboundRoutePackageCreated": {}
                  }
                  //hide - toast messages
                  destination.hideIsRouteCreated = destination.routeProvisonDetails?.isRouteCreated?.status === false;
                  destination.hideIsRouteUpdated = destination.routeProvisonDetails?.isRouteUpdated?.status === false;
                  destination.hideInboundRoutePackageCreated = destination.routeProvisonDetails?.inboundRoutePackageCreated?.status === false;
                  destination.hideOutboundRoutePackageCreated = destination.routeProvisonDetails?.outboundRoutePackageCreated?.status === false;
                  destination.hideIsSubscriptionCreated = destination.routeProvisonDetails?.isSubscriptionCreated?.status === false;
                  destination.hideIsSubscriptionUpdated = destination.routeProvisonDetails?.isSubscriptionUpdated?.status === false;
              })
              input.pageData.currentRoutes = input.pageData.route.currentRoutes || [];
              input.pageData.currentRoute = input.pageData.route;
              let completedRoutes = input.pageData.route.currentRoutes.reduce((result, route, index) => {
                  if (route?.destinations?.some((dest) => dest.isRouteCreated === true)) {
                      result.push(index)
                  }
                  return result;
              }, []);
              let indexesToString = (completedRoutes.length === 1) ? completedRoutes : completedRoutes.join(',');
              input.pageData.indexToDisable = input.pageData.showRouteprogress ? indexesToString : ''
          })

      }
      if(input.pageData.route.resourceType === "Legacy"){
          input.pageData.route.partnerAccount =  input.pageData.route.account; 
          input.pageData.currentRoute = input.pageData.route;
      }
input.pageData.routeOnSucesspcd =
  input.pageData?.route?.source?.postClientDownload?.onSuccessPostClientDownload ||
  input.pageData?.postClientDownloads?.onSuccess?.[0]?.value;

input.pageData.routeOnFailurepcd =
  input.pageData?.route?.source?.postClientDownload?.onFailurePostClientDownload ||
  input.pageData?.postClientDownloads?.onFailure?.[0]?.value;

input.pageData.routeOnSucessprs =
  input.pageData?.route?.source?.postRouteSettings?.onSuccessPostRoutingSettings ||
  input.pageData?.postRouteSettings?.postonSuccess?.[0]?.value;

input.pageData.routeOnFailureprs =
  input.pageData?.route?.source?.postRouteSettings?.onFailurePostRoutingSettings ||
  input.pageData?.postRouteSettings?.postonFailure?.[0]?.value;

      console.log("pageData1==>", input);
      return true;
  } catch (error) {
      console.log("error==>", error);
  }
}