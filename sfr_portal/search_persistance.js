function savePersistentSearch(input) {
    const searchValue = input.search;
    const filters = input.filters;
    const sortBy = input.sortBy; 
    const sortOrder = input.sortOrder;
    const limit = input.limit;
    const offset = input.offset;
    const searchFieldName = input.searchFieldName;
    const filtersFieldName = input.filtersFieldName;
    const sortByFieldName = input.sortByFieldName;
    const sortOrderFieldName = input.sortOrderFieldName;
    const limitFieldName = input.limitFieldName;
    const offsetFieldName = input.offsetFieldName;
    //Set a expiry for each tab. Read from app config.
    const expiryMinutes = Number(input.context.app.config.searchPersistanceExpirationTime);
    //Read the key from app config to store the data in localStorage.
    const searchPersistanceKey = input.context.app.config.searchPersistanceKey;
    const roleObj = input.role; // dynamic keys like { isBU: true, isITAdmin: false }
  
    // Determine active role dynamically (exclude userExists)
    let roleValue = "";
    for (const key of Object.keys(roleObj || {})) {
      if (key !== "userExists" && roleObj[key]) {
        roleValue = key;
        break; 
      }
    }
  
    // Parse schema from app config.
    let schema = input.context.app.config.defaultSearchPersistanceSchema;
    if (typeof schema === "string") schema = JSON.parse(schema);
  
    // Parse tabValues from app config.
    let tabValues = input.context.app.config.searchPersistanceTabValues;
    if (typeof tabValues === "string") {
      try {
        tabValues = JSON.parse(tabValues);
      } catch {
        tabValues = [];
      }
    }
  
    // Extract page identifier from url.
    const match = window.location.hash.match(/#([a-zA-Z0-9-]+)/);
    const pageIdentifier = match ? match[1] : "";
  
    // Map hash → tabName
    let tabValue = pageIdentifier;
    if (Array.isArray(tabValues)) {
      const found = tabValues.find(t => t.pageIdentifier === pageIdentifier);
      if (found) tabValue = found.tabName;
    }
  
    // Retrieve existing localStorage data
    let existingData = [];
    try {
      existingData = JSON.parse(localStorage.getItem(searchPersistanceKey)) || [];
    } catch {
      existingData = [];
    }
  
    const currentTime = Date.now();
    const forDataSource = input.forDataSource === 'true';
  
    // console.log("forDataSource",input.forDataSource);
  
    if (forDataSource) {
      const updatedList = existingData.filter(item => {
        if (item.role === roleValue && item.tab === tabValue) {
          const expireAt = new Date(item.searchSettings?.expireAt).getTime();
          if (isNaN(expireAt) || expireAt <= currentTime) return false;
  
          const settings = item.searchSettings || {};
  
          if (searchFieldName)
            input.pageData[searchFieldName] = settings.searchValue;
          if (filtersFieldName)
            input.pageData[filtersFieldName] = settings.filters;
          if (sortByFieldName)
            input.pageData[sortByFieldName] = settings.sortBy;
          if (sortOrderFieldName)
            input.pageData[sortOrderFieldName] = settings.sortOrder;
          if (offsetFieldName && limitFieldName)
          {
            if( settings.offset !== 0 ){
              input.pageData[offsetFieldName] = 0;
              input.pageData[limitFieldName] = settings.offset + Number(input.context.app.config.limit);
            }
          }
        }
        return true;
      });
  
      if (updatedList.length !== existingData.length) {
        localStorage.setItem(searchPersistanceKey, JSON.stringify(updatedList));
      }
      return true;
    }
  
    // --- Save Mode ---
    const index = existingData.findIndex(item => item.tab === tabValue && item.role === roleValue);
    let updatedConfig;
  
    if (index !== -1) {
      updatedConfig = { ...existingData[index] };
      updatedConfig.searchSettings = { ...existingData[index].searchSettings };
    } else {
      updatedConfig = JSON.parse(JSON.stringify(schema));
      updatedConfig.tab = tabValue;
      updatedConfig.role = roleValue;
      updatedConfig.searchSettings.expireAt = new Date(currentTime + expiryMinutes * 60 * 1000).toISOString();
    }
  
    // Update only provided fields
    if (searchValue !== undefined) updatedConfig.searchSettings.searchValue = searchValue;
    if (filters !== undefined) updatedConfig.searchSettings.filters = filters;
    if (sortBy !== undefined) updatedConfig.searchSettings.sortBy = sortBy;
    if (sortOrder !== undefined) updatedConfig.searchSettings.sortOrder = sortOrder;
    if (limit !== undefined) updatedConfig.searchSettings.limit = limit;
    if (offset !== undefined) updatedConfig.searchSettings.offset = offset;
  
    updatedConfig.searchSettings.expireAt = new Date(currentTime + expiryMinutes * 60 * 1000).toISOString();
  
    // Dynamically set pageData
    if (searchFieldName && searchValue !== undefined) input.pageData[searchFieldName] = searchValue;
    if (filtersFieldName && filters !== undefined) input.pageData[filtersFieldName] = filters;
    if (sortByFieldName && sortBy !== undefined) input.pageData[sortByFieldName] = sortBy;
    if (sortOrderFieldName && sortOrder !== undefined) input.pageData[sortOrderFieldName] = sortOrder;
    if (limitFieldName && limit !== undefined) input.pageData[limitFieldName] = limit;
    if (offsetFieldName && offset !== undefined) input.pageData[offsetFieldName] = offset;
  
    if (index !== -1) {
      existingData[index] = updatedConfig;
    } else {
      existingData.push(updatedConfig);
    }
  
    localStorage.setItem(searchPersistanceKey, JSON.stringify(existingData));
    return true;
  }