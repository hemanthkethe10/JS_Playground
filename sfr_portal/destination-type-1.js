function run(input) {
  try {
    let fieldParam = input.pageForm.currentRoutes[input.index].destinations[input.dIndex].destinationType;
    //destination conditions for Inbound/Internal
    input.pageData.currentRoutes[input.index].destinations[input.dIndex].isOutbound = 
    JSON.stringify(input.pageData.sources) === JSON.stringify(input.pageData.destinations) ? !input.pageData.isInbound : input.pageData.isInbound;
     //destination conditions for Outbound/Internal
    input.pageData.currentRoutes[input.index].destinations[input.dIndex].isInbound = 
    JSON.stringify(input.pageData.sources) === JSON.stringify(input.pageData.destinations) ? !input.pageData.isOutbound : input.pageData.isOutbound;    input.pageData.currentRoutes[input.index].destinations[input.dIndex].showRemoteSite = fieldParam === "Partnerhosted";
    input.pageData.currentRoutes[input.index].destinations[input.dIndex].showNHA = fieldParam === "NYLhosted";
      if(input.pageData.isOutbound)
      {
       //partner-script
           let account = input.pageData.partnerAccount;
           let folderType = input.pageForm.currentRoutes[input.index].destinations[input.dIndex].folderType;
           if(folderType && folderType === "existingFolder"){
            $(document).ready(function() 
            {
            let button = document.getElementById(`folders-button-${input.index}-${input.dIndex}`)
            button.click();})
            }
            let accountInfo = input.pageData.partnerAccounts.filter((it)=>it.value === account);
            if(account)
            {
             input.pageData.currentRoutes[input.index].destinations[input.dIndex].showAccountDetailsInfo = true;
             input.pageData.currentRoutes[input.index].destinations[input.dIndex].accountInfo = accountInfo;
            }
             if (input.pageForm.currentRoutes[input.index].destinations[input.dIndex].destinationType === "Partnerhosted")
            {
             $(document).ready(function() {
             document.getElementById(`sites-button-${input.index}-${input.dIndex}`).click()
             })
             }
      }
       if (fieldParam) 
       {
         input.pageData.currentRoutes[input.index].destinations[input.dIndex].showTransferAccount = fieldParam === "TransferAccount";
         input.pageData.currentRoutes[input.index].destinations[input.dIndex].showInternalSite = (fieldParam === "InternalSite" || fieldParam === "PartnerSite");    
         input.pageData.currentRoutes[input.index].destinations[input.dIndex].showApplicationAccount = fieldParam === "ApplicationAccount";
         //set accountName param for fetch subscription
            if (fieldParam === "InternalSite" || fieldParam ===  "PartnerSite"){
              let accountName = (input.pageData.buInternalSites) && (input.pageData.buInternalSites[0]?.account)
            input.pageData.currentRoutes[input.index].destinations[input.dIndex].accountName = accountName;
             }
            if (fieldParam === "TransferAccount"){
               input.pageData.currentRoutes[input.index].destinations[input.dIndex].accountName = input.pageData.userSTAccount?.accountInfo?.accountName || '' ;
               }
        }
      else 
      {
        input.pageData.currentRoutes[input.index].destinations[input.dIndex].showDestinationFolder = false;
      }
     console.log("pageData=>",input.pageData);
     return true;
      }
  catch (error) {
    console.log("ERROR: ", error);
}
}