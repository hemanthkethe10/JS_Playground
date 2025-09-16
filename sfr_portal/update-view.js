function run (input) {
    try{
    input.pageData.showNew = input.pageData.route.requestType==="New";
    input.pageData.showInstance = true;
    input.pageData.showDirection = true;
    input.pageData.showPartner = true;
    input.pageData.showPartnerDetails = true;
    input.pageData.partnerAccount = input.pageData.route.partnerAccount;
    input.pageData.account = input.pageData.route.account;
    input.pageData.clients = input.pageData.partnerInfo.clients;
    input.pageData.isInbound = input.pageData.route.direction === "Inbound";
    input.pageData.isOutbound = input.pageData.route.direction === "Outbound";
    input.pageData.showAccountDetailsInfo = input.pageData.isInbound;
    input.pageData.showInternalSite = input.pageData.route.source.name === "InternalSite";
    input.pageData.showAccountDetails =  input.pageData.isInbound;
    input.pageData.siteDetails =  input.pageData.showInternalSite && input.pageData.isOutbound;
    input.pageData.partnerAccounts = input.pageData.partnerInfo.accounts;
    input.pageData.partnerAccounts.forEach((account)=>{
      account.value = account.accountName;
     account.label= account.accountName})
    input.pageData.accountInfo = input.pageData.partnerAccounts.filter((partner)=>partner.value === input.pageData.route.partnerAccount);
    if (input.pageData.isOutbound){
      let source =  input.pageData.route.source.name;
      input.pageData.showApplicationAccount = source === "ApplicationAccount";
      input.pageData.showInternalSite =  source === "InternalSite";
      input.pageData.showTransferAccount = source === "TransferAccount";
      input.pageData.showExistingFolder = input.pageData.route.source.folderType === "existingFolder";
      input.pageData.showNewFolder = input.pageData.route.source.folderType === "newFolder";
      input.pageData.showPA = true;
    }
    if(input.pageData.route.direction === "Inbound"){
      input.pageData.sources = [{"label":"NYL Hosted Partner Account","value":"NYLhosted"},{"label":"Partner hosted NYL Account","value":"Partnerhosted"}];
      input.pageData.destinations = [{"label":"My File Transfer Account","value":"TransferAccount"},{"label":"Internal Site","value":"InternalSite"},{"label":"Application Account","value":"ApplicationAccount"}];
      input.pageData.selectedSite = (input.pageData.route.source.siteName) && input.pageData.partnerTransferSites?.filter((site)=>site.name === input.pageData.route.source.siteName)?.at(0);
      input.pageData.showAccountDetailsSite = (input.pageData.route.source.siteName) && (input.pageData.route.source.siteName) ? true : false ;
      input.pageData.showFilePatternSite = input.pageData.showAccountDetailsSite;
      input.pageData.showPA = false;
    }
    else {
      input.pageData.sources =[{"label":"My File Transfer Account","value":"TransferAccount"},{"label":"Internal Site","value":"InternalSite"},{"label":"Application Account","value":"ApplicationAccount"}]
      input.pageData.destinations =[{"label":"NYL Hosted Partner Account","value":"NYLhosted"},{"label":"Partner hosted NYL Account","value":"Partnerhosted"}];
      input.pageData.selectedSite = (input.pageData.route.source.siteName) && (input.pageData.route.source.siteName) && input.pageData.buInternalSites?.filter((site)=>site.name === input.pageData.route.source.siteName)?.at(0);
    }
    //sourceFolders
    input.pageData.fileIds = input.pageData.fileIds.result;
    if(input.pageData.route.source?.folderType === "existingFolder"){
      let sourceFolders = input.pageData?.acountFolders?.filter((info)=>info.accountName === input.pageData.route.account && info.type ==="folder")
      input.pageData.sourceFolders = sourceFolders?.at(0)?.result;
    }
    input.pageData.showRemoteSite = input.pageData.route.source.name === "Partnerhosted";
      if(input.pageData.route.currentRoutes.length){
       input.pageData.route.currentRoutes.forEach((route)=>{
         route.showDescription = true; 
         route.showFileIdDetails = true;
         route.showCron = input.pageData.route.source.schedule === "cron";
         route.showRenameExample = (input.pageData.route.direction === "Outbound") && (route.renameFile.enabled === "true");
         let fileIDInfo = input.pageData.fileIds.filter((it)=> it.fileId === route.fileId)
         route.fileIDInfo = fileIDInfo[0];
         route?.destinations?.forEach((destination) => {
        if(route.destinations.length){
          //folders
          if(destination?.folderType === "existingFolder"){
            let destinationFolders = input.pageData?.acountFolders?.filter((info)=>info.accountName === destination.accountName && info.type === "folder")
            destination.folders = destinationFolders?.at(0)?.result;
          }
         if(input.pageData.isInbound){
          destination.selectedSite = (destination.remoteSite) && (destination.remoteSite.name) && input.pageData.buInternalSites?.filter((site)=>site.name === destination.remoteSite.name)?.at(0);
          route.shownFolder = input.pageData.route.source?.folderType === "newFolder";
          route.showeFolder = input.pageData.route.source?.folderType === "existingFolder";
         }
         else{
          let sites = input.pageData?.acountFolders?.filter((info)=>info.accountName === destination?.accountName && info.type == "sites");
          destination.selectedSite = sites?.at(0)?.result?.at(0);
          (destination.destinationType === "Partnerhosted") ? destination.destinationSites = input.pageData?.acountFolders?.filter((info)=>info.accountName === destination.accountName && info.type === "sites")?.at(0).result: [];
          destination.pgpFiles = (destination.pgpEncrypt.enabled ==="true") ? input.pageData?.acountFolders?.filter((info)=>info.accountName === input.pageData.route.account && info.type==="pgp")?.at(0).result : [];
          route.shownFolder = (input.pageData.route.source.name === "InternalSite") && (input.pageData.route.source?.folderType === "newFolder");
          route.showeFolder = (input.pageData.route.source.name === "InternalSite") && (input.pageData.route.source?.folderType === "existingFolder");
         }
         destination.isInbound = !input.pageData.isInbound;
         destination.isOutbound = !input.pageData.isOutbound;
         route.showFileDestination = true;
         destination.showNHA =  destination.destinationType === "NYLhosted";
         destination.showExistingFolder = destination.folderType === "existingFolder";
         destination.showNewFolder = destination.folderType === "newFolder";
         destination.accountInfo = (destination.accountName) && input.pageData.partnerAccounts?.filter((partner)=>partner.accountName === destination.accountName)
         destination.showRenamingEx = (input.pageData.route.direction === "Inbound") && destination.renameFile.enabled === "true";
         destination.showPGP = (input.pageData.route.direction === "Outbound") && destination.pgpEncrypt.enabled === "true";
         destination.showPassword = (input.pageData.route.direction === "Outbound") && destination.requirePassword.enabled === "true";
         destination.showSuccessEmails = destination.successDelivery.enabled === "true";
         destination.showEmails = destination.failedDelivery.enabled === "true";
         destination.showTransferAccount = destination.destinationType === "TransferAccount";
         destination.showInternalSite = destination.destinationType === "InternalSite";
         destination.showApplicationAccount = destination.destinationType === "ApplicationAccount";
         destination.showNewFolderAppAccount = (destination.showApplicationAccount) && (destination.folderType === "newFolder");
         destination.showExistingFolderAppAccount = (destination.showApplicationAccount) && (destination.folderType === "existingFolder");
         destination.showRemoteSite = (input.pageData.isOutbound) && destination.destinationType === "Partnerhosted";
     } 
     })
     input.pageData.currentRoutes = input.pageData.route.currentRoutes || [];
     input.pageData.currentRoute = input.pageData.route;  
    })
    console.log("pageData==>",input.pageData);
    return true;
    }
    }
    catch(error)
    {
        console.log("error==>",error);
    }
  }