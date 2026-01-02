function run(input) {
  try {
    let currentCount;
    let limit = parseInt(input.limit);
    console.log(input.pageData);
    
    // Reset offset if showResults is true
    if (input.showResults == "true") {
      input.pageData.offset = 0;
    }
    
    // Update dataCount for non-sort operations
    if (input.type !== "sort") {
      input.pageData.dataCount = input.requests.count;
    }
    
    let length = input.requests?.result?.length || 0;
    
    if (input.requests.result === undefined || length === 0) {
      input.pageData.isEmpty = true;
      input.pageData.showMore = false;
    } else {
      currentCount = parseInt(input.pageData.offset) + limit;
      input.pageData.showMore = currentCount < input.pageData.dataCount;
      input.pageData.isEmpty = false;
      
      // Process each request item
      input.requests.result.forEach((request) => {
        request.isOwner = request.createdBy === input.email;
        request.format = request.submittedOn ? "DATE" : "";
        request.submittedOn = request.submittedOn || "NA";
        request.hideClone = request.instance === input.context.prodInstanceName;
        request.showCloneToProd = false;
        
        // Handle clone-to-prod eligibility logic
        if (
          request?.testConnectionInfo?.provisionDetails &&
          request.instance !== input.context.prodInstanceName &&
          request?.isAccountCreatedInProd !== true &&
          input.pageData.prodStatus?.prodEnabled === true
        ) {
          let provisionDetails = request.testConnectionInfo.provisionDetails;
          
          request.showCloneToProd =
          input.pageData.prodStatus?.prodEnabled &&
          !(provisionDetails?.subscription?.isSubscriptionCreated === false) &&
          !(provisionDetails?.sshAndpgp?.sshKeyStatus?.isCertificateUploaded === false) &&
          !(provisionDetails?.sshAndpgp?.pgpKeyStatus?.isCertificateUploaded === false) &&
          !(provisionDetails?.inboundPackage?.isPackageCreated === false) &&
          !(provisionDetails?.outboundPackage?.isPackageCreated === false) &&
          !(provisionDetails?.transferSite?.isTransferSiteCreated === false) &&
          !(provisionDetails?.transferSite?.sshKey?.isCertificateUploaded === false) &&
          !(provisionDetails?.account?.isSuccessful === false);
        }
        if (
          request?.sites &&
          request.instance !== input.context.prodInstanceName &&
          request?.isAccountCreatedInProd !== true 
        ){
          request.showCloneToProd = request.sites.every(site => site?.creationStatus?.isCreated === true);
        }
      });
      
      
      
      // Assign current requests and map additional fields
      input.pageData.currentRequests = input.requests.result.map((request) => {
        request.ritmNumber =
        typeof request.snowInfo !== "undefined" && request.snowInfo.ritmNumber
        ? request.snowInfo.ritmNumber
        : "NA";
        return request;
      });
      input.pageData.ascendingImage = {};
      input.pageData.descendingImage = {};
      
      if (input.pageData.order === 1) {
        input.pageData.ascendingImage[input.pageData.field] = true;
      } else {
        input.pageData.descendingImage[input.pageData.field] = true;
      }
      
    }
    
    console.log("pdc", input.pageData);
    return true;
  } catch (error) {
    console.log("ERROR:", error);
  }
}