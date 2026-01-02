module.exports = (input) => {
    try {
        let statuses = JSON.parse(input.context.app.config.onboardingRequestStates);
        
        // Return null if "All" is included
        if (input.status.includes("All")) {
            return null;
        }
        
        // Create a copy of the filter and remove existing status property
        let finalFilter = { ...input.filter };
        if (finalFilter.hasOwnProperty("status")) {
            delete finalFilter.status;
        }
        
        let andConditions = [];
        
        // Process each status in the input
        input.status.forEach((statusKey) => {
            let condition = {};
            
            switch (statusKey) {
                case "byMe":
                    let filterByMe = (input.isBU) ? 
                        { "createdBy": input.context.principal.userName } : 
                        { "claimedBy": input.context.principal.userName };
                    Object.assign(condition, filterByMe);
                    break;
                
                case "closed":
                    Object.assign(condition, {
                        "$and": [
                            { "status": { "$in": [statuses.closed, statuses.accountProvisioned] } },
                            { "instance": input.context.app.config.testInstanceName },
                            { "isAccountCreatedInProd": { "$exists": false } }
                        ]
                    });
                    break;
                
                case "claimed":
                    Object.assign(condition, {
                        "$and": [
                            { "status": { "$in": [statuses.claimed] } },
                            { "lastActivityTime": { "$lt": Date.now() - input.context.app.config.threeDaysinMillis } }
                        ]
                    });
                    break;
                
                case "unprocessedClaimedByMe":
                    if (input.isBU) {
                        Object.assign(condition, {
                            "$and": [
                                { "status": { "$in": [statuses.claimed] } },
                                { "lastActivityTime": { "$lt": Date.now() - input.context.app.config.threeDaysinMillis } },
                                { "createdBy": input.context.principal.userName }
                            ]
                        });
                    } else {
                        Object.assign(condition, {
                            "$and": [
                                { "status": { "$in": [statuses.claimed] } },
                                { "lastActivityTime": { "$lt": Date.now() - input.context.app.config.threeDaysinMillis } },
                                { "claimedBy": input.context.principal.userName }
                            ]
                        });
                    }
                    break;
                    case "siteProvisioned":
                        Object.assign(condition, {
                            "$and": [
                                { "instance": input.context.app.config.testInstanceName },
                                { "status": statuses.siteCreated}
                            ]
                        });
                        break;
                
                    case "prodSiteProvisioned":
                        Object.assign(condition, {
                            "$and": [
                                { "instance": input.context.app.config.prodInstanceName },
                                { "status": statuses.prodSiteCreated }
                            ]
                        });
                        break;
                
                default:
                    // Handle regular status values from the config
                    const statusValue = statuses[statusKey];
                    if (statusValue) {
                        Object.assign(condition, { "status": statusValue });
                    }
                    break;
            }
            
            // Add condition to andConditions if it has content
            if (Object.keys(condition).length > 0) {
                andConditions.push(condition);
            }
        });
        
        // Return filter as-is if no conditions were added
        if (andConditions.length === 0) {
            return finalFilter;
        }
        
        // Add conditions to the filter
        if (finalFilter.hasOwnProperty("$and")) {
            finalFilter["$and"] = finalFilter["$and"].concat(andConditions);
        } else {
            finalFilter["$and"] = andConditions;
        }
        
        return finalFilter;
        
    } catch (error) {
        console.error("Error in Fetch Onboarding requests filter script:", error);
        return input.filter || {};
    }
};