function (input) {
    try {
        // 1️⃣ Grey div condition first
        if (
            input.pageData.transferSite.status === "Model: Site Provisioned" ||
            input.pageData.transferSite.status === "Production: Site Provisioned" ||
            input.pageData.transferSite.status === "Closed"
        ){
            input.pageData.greyDiv = true;
            // 2️⃣ Map sites safely
            if (input.pageData.transferSite) {
                input.pageData.transferSites = input.pageData.transferSite.sites;
                
                // 3️⃣ For each site
                input.pageData.transferSite.sites.forEach(site => {
                    if (site.creationStatus?.isCreated === true) {
                        site.isSiteCreated = true;
                        site.isSiteFailed = false;
                    } else {
                        site.isSiteCreated = false;
                        site.isSiteFailed = true;
                    }
                }); // ← Added missing closing parenthesis and semicolon
            }
        }
        
        input.pageData.networkZone = input.pageData.networkZone.filter((networkZone) => networkZone.name !== 'Private');
        input.pageData.hideDetails = true;
        
        const networkZoneNames = ['none', 'any', 'Default'];
        const existingNames = input.pageData.networkZone.map(networkZone => networkZone.name);
        
        networkZoneNames.forEach(name => {
            if (!existingNames.includes(name)) {
                input.pageData.networkZone.push({ name });
            }
        });
        
        input.pageData.networkZone.forEach((networkZone) => {
            networkZone.label = networkZone.name;
            networkZone.value = networkZone.name;
        });
        
        return true;
    } catch (error) {
        console.error("Error:", error);
        return false; // ← Better to return false on error
    }
}