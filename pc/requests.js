function run(input) {
  try {
    let currentCount;
    let limit = parseInt(input.limit);
    console.log(input.pageData);
    if (input.showResults == "true") {
      input.pageData.offset = 0;
    }

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
      //console.log("pd",input.pageData);
      input.pageData.isEmpty = false;
      input.requests.result.forEach((request) => {
        request.isOwner = request.createdBy === input.email;
        request.format = request.submittedOn ? "DATE" : "";
        request.submittedOn = request.submittedOn || "—";
        request.hideClone = request.instance === input.context.prodInstanceName;
        request.showCloneToProd = false;
        if (
          request?.testConnectionInfo?.provisionDetails &&
          request.instance !== input.context.prodInstanceName &&
          request?.isAccountCreatedInProd !== true &&
          input.pageData.prodStatus?.prodEnabled === true
        ) {
          let provisionDetails = request.testConnectionInfo.provisionDetails;
          request.showCloneToProd =
            input.pageData.prodStatus?.prodEnabled &&
            !(
              provisionDetails?.subscription?.isSubscriptionCreated === false
            ) &&
            !(
              provisionDetails?.sshAndpgp?.sshKeyStatus
                ?.isCertificateUploaded === false
            ) &&
            !(
              provisionDetails?.sshAndpgp?.pgpKeyStatus
                ?.isCertificateUploaded === false
            ) &&
            !(provisionDetails?.inboundPackage?.isPackageCreated === false) &&
            !(provisionDetails?.outboundPackage?.isPackageCreated === false) &&
            !(
              provisionDetails?.transferSite?.isTransferSiteCreated === false
            ) &&
            !(
              provisionDetails?.transferSite?.sshKey?.isCertificateUploaded ===
              false
            ) &&
            !(provisionDetails?.account?.isSuccessful === false)
              && !(provisionDetails?.partnerToSTSite?.isTransferSiteCreated === false);
        }
      });
      input.pageData.currentRequests = input.requests.result;

      input.pageData.currentRequests = input.pageData.currentRequests.map(
        (request) => {
          request.ritmNumber =
            typeof request.snowInfo !== "undefined" &&
            request.snowInfo.ritmNumber
              ? request.snowInfo.ritmNumber
              : "—";
          return request;
        }
      );
    }
    console.log("pdc", input.pageData);
    return true;
  } catch (error) {
    console.log("ERROR: ", error);
  }
}
