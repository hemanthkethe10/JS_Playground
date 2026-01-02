function setITAdminData(input) {
    try {
      
      // Use map or just forEach without assignment
      input.pageData.transferSite.sites.forEach((site) => {
        site.showKey = site.loginType === "sshKey";
        site.showPassword = site.loginType === "password";
      });
      
      // Now assign the modified sites array
      input.pageData.transferSites = input.pageData.transferSite.sites;
      
      input.pageData.accountName = input.pageData.transferSite.partnerName;
      input.pageData.universalAccounts = input.pageData.stSettings.universalAccounts;
      input.pageData.networkZone = input.pageData.networkZone.filter((networkZone) => networkZone.name !== 'Private');
      
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
      input.pageData.isProdRequest = input.pageData.transferSite.instance === input.context.prodInstanceName;

      input.pageData.transferSite.sites.forEach((site) => {
        site.tentativeSiteName = input.pageData.transferSite.partnerName +' '+ site.tentativeSiteName +' '+ input.pageData.transferSite.requestId +' '+ site.siteId;
      });
      
      
    } catch (error) {
      console.error("Error:", error);
    }
    return true;
  }