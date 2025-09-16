function processNotifications(input) {
    console.log("last1");
    console.log(input);
        try {
            let currentCount;
            let limit = parseInt(input.limit);
           // console.log(input.pageData);
            if (input.showResults === "true") {
                input.pageData.offset = 0;
            }
    
            if (input.type !== "sort") {
                input.pageData.dataCount = input.notifications.count;
            }
            let length = input.notifications?.result?.length || 0;
            if (input.notifications.result === undefined || length === 0) {
                input.pageData.isEmpty = true;
                input.pageData.showMore = false;
            } else {
                currentCount = parseInt(input.pageData.offset) + limit;
                console.log("pd",input.pageData);
                input.pageData.showMore = (currentCount < input.pageData.dataCount);
                input.pageData.isEmpty = false;
    
                // Format Notifications
                input.notifications.result.forEach((notification) => {
                    notification.isScheduleEnabled = notification?.isScheduleEnabled ? true : false;
                    notification.ruleBusinessUnit = notification.ruleBusinessUnit || "NA";
     if ((!notification?.scheduleInfo?.scheduleFrequency)) {
                        notification.scheduleInfo = notification.scheduleInfo || {};
                        notification.scheduleInfo.scheduleFrequency = "None";
                  }
                });
            }
        //    console.log("c", input);
            input.pageData.currentNotifications = input.notifications.result;
    
            // Process Display Mapping
            const validValues = [
                "notificationNature", "partnerName", "partnerAccount", "client", "fileId", "fileCount", "ruleBusinessUnit", "sourceFileName", "status", "businessTags", "duration", "customDuration"
            ];
            const validFileIdValues = [
                "description", "fileNameingPattern", "fileNameingExample", "idType", "idValue", "division", "dataSensitivity"
            ];
    
            const displayMap = {
                "notificationNature": "Notification Nature",
                "partnerAccount": "Partner Account",
                "businessTags": "Business Tags",
                "client": "Client",
                "ruleBusinessUnit": "Business Unit",
                "fileCount": "File Count",
                "source": "Source",
                "status": "Status",
                "fileId": "File Id",
                "partnerName": "Partner",
                "sourceFileName": "Source File Name",
                "duration": "Duration",
                "customDuration": "Custom Days"
            };
    
            const displayFileIdMap = {
                "description": "File Description",
                "fileNameingPattern": "File Nameing Pattern",
                "fileNameingExample": "File Nameing Example",
                "idType": "ID Type",
                "idValue": "ID Value",
                "division": "Division",
                "dataSensitivity": "Data Sensitivity"
            };
    
            let updatedData = input.notifications.result.map((myObject) => {
                myObject.filters = [];
    
                for (const key in myObject) {
                    if (!myObject.hasOwnProperty(key)) continue;
    
                    const value = myObject[key];
                    if (value && validValues.includes(key)) {
                        if(key==="ruleBusinessUnit" && value==="NA")
                            {
                                continue;
                            }
                        else{
                        myObject.filters.push(displayMap[key] || key);
                        }
                    }
                }
              console.log("last");
    console.log(input);
    
                if (myObject.fileIdInfo) {
                    for (const key in myObject.fileIdInfo) {
                        if (!myObject.fileIdInfo.hasOwnProperty(key)) continue;
    
                        const value = myObject.fileIdInfo[key];
                        if (value && value.enabled && validFileIdValues.includes(key)) {
                            myObject.filters.push(displayFileIdMap[key] || key);
                        }
                    }
                }
    
                myObject.filters = myObject.filters.join(', ');
    
                return myObject;
            });
    
            input.pageData.currentNotifications = updatedData;
    
            return input.pageData;
        } catch (error) {
            console.log("ERROR: ", error);
        }
    
    }