function loadScroll(input) {
    //id or querySelector ,key
    $(document).ready(() => {
        let tableElement = null;
        if(input.id){
            tableElement = document.getElementById(input.id);
        }
        else{
            tableElement = document.querySelector(input.querySelector);
        }
        if(tableElement){
            let tableContent = tableElement.children[1];
            let cachedScrollPosition = localStorage.getItem(input.key);
            if(cachedScrollPosition){
                requestAnimationFrame(() => { tableContent.scrollTop = cachedScrollPosition; });
            }
        }
    });
    return true;
  }


  function persistScroll(input) {
    //id or querySelector ,key
    $(document).ready(() => {
        let tableElement = null;
        if(input.id){
            tableElement = document.getElementById(input.id);
        }
        else{
            tableElement = document.querySelector(input.querySelector);
        }
        if(tableElement){
            let tableContent = tableElement.children[1];
            // Add scroll event listener to automatically save scroll position
            tableContent.addEventListener('scroll', () => {
                localStorage.setItem(input.key, tableContent.scrollTop);
                console.log("successfully persisted scroll position", tableContent.scrollTop);
            });
        }
    });
    return true;
  }


  function persistScroll(input) {
    $(document).ready(() => {
      let tableElement = null;
      if (input.id) {
        tableElement = document.getElementById(input.id);
      } else {
        tableElement = document.querySelector(input.querySelector);
      }
      
      if (tableElement) {
        let tableContent = tableElement.children[1];
        
        // Read the key from app config to store the data in localStorage
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

        let tabValues = (typeof tabValues === "string") ? JSON.parse(tabValues) : [];
        
        // Extract page identifier from url
        const match = window.location.hash.match(/#([a-zA-Z0-9-]+)/);
        const pageIdentifier = match ? match[1] : "";
        
        // Map hash → tabName
        let tabValue = pageIdentifier;
        if (Array.isArray(tabValues)) {
          const found = tabValues.find(t => t.pageIdentifier === pageIdentifier);
          if (found) tabValue = found.tabName;
        }
        
        // Parse schema from app config for creating new entries
        let schema = input.context.app.config.defaultSearchPersistanceSchema;
        if (typeof schema === "string") {
          try {
            schema = JSON.parse(schema);
          } catch {
            schema = { tab: "", role: "", searchSettings: {} };
          }
        }
        
        // Add scroll event listener to automatically save scroll position
        tableContent.addEventListener('scroll', () => {
          const scrollPosition = tableContent.scrollTop;
          
          // Retrieve existing localStorage data
          let existingData = [];
          try {
            existingData = JSON.parse(localStorage.getItem(searchPersistanceKey)) || [];
          } catch {
            existingData = [];
          }
          
          // Find the entry for current tab and role
          const index = existingData.findIndex(item => item.tab === tabValue && item.role === roleValue);
          
          if (index !== -1) {
            // Update existing entry
            existingData[index][scrollKey] = scrollPosition;
            console.log("Successfully persisted scroll position:", scrollPosition, "for tab:", tabValue, "role:", roleValue, "key:", scrollKey);
          } else {
            // Create new entry
            const newEntry = JSON.parse(JSON.stringify(schema));
            newEntry.tab = tabValue;
            newEntry.role = roleValue;
            newEntry[scrollKey] = scrollPosition;
            existingData.push(newEntry);
            console.log("Created new entry and persisted scroll position:", scrollPosition, "for tab:", tabValue, "role:", roleValue, "key:", scrollKey);
          }
          
          localStorage.setItem(searchPersistanceKey, JSON.stringify(existingData));
        });
      }
    });
    return true;
  }



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
    const regularExpression = /#([a-zA-Z0-9-]+)/
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
  
    console.log("existingData",existingData);
  
    if (forDataSource) {
      const updatedList = existingData.filter(item => {
        if (item.role === roleValue && item.tab === tabValue) {
          console.log("inside filter",item);
          
          const expireAt = new Date(item.searchSettings?.expireAt).getTime();
          if (expireAt <= currentTime) return false;
  
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
        console.log("hello",updatedList);
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