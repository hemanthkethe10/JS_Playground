function r(input) {
    let accountNames = [];
    if(input.route.source?.folderType === "existingFolder"){
        accountNames.push({"type":"folder","accountName":input.route.account})
    }
    if(input.route.source.name === "InternalSite"){
        accountNames.push({"type":"sites","accountName":input.route.account})
    }
    input.route?.currentRoutes?.map((route)=>{
        route?.destinations?.map((destination)=>{
           let accountName = destination?.accountName;
            if(destination?.folderType === "existingFolder"){
                let accountName = destination?.accountName;
                accountNames.push({"type":"folder","accountName":accountName})    
            }
            if(destination?.pgpEncrypt?.enabled === "true"){
                accountNames.push({"type":"pgp","accountName":input.route.account})
            }
            if(destination?.destinationType === "Partnerhosted"){
                accountNames.push({"type":"sites","accountName":accountName})
            }
            if(destination?.destinationType === "InternalSite"){
                accountNames.push({"type":"sites","accountName":accountName})
            }
        })
    })
    input.pageData.fetchAccountNames = accountNames;
    return true;
    }