function processInput(input) {
    // Setting up default values and extracting data from input
    input.pageData.scheduleDuration = input?.duration ?? "";
    input.pageData.scheduleTimeDuration = input?.timeDuration ?? "";
    input.pageData.scheduleWeekDays = input?.weekDays ?? "";
    input.pageData.scheduleMonthdays = input?.monthDays ?? "";
  
      input.pageData.presentTimeStamp = Date.now();
  
  let scheduleEnabled = input?.scheduleEnabled === true || input?.scheduleEnabled === "true" ? true : false;
    input.pageData.scheduleEnabled = scheduleEnabled
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    function extractEmails(emailString) {
          let emails = emailString.split(',').map(item => item.trim());
          let validEmailArray = emails.filter(email => {
      if (!emailRegex.test(email)) {
         input.pageData.showScheduleError = false
      input.pageData.scheduleError = "Please Enter Valid Emails";
  
      throw new Error("Please Enter Valid Emails");
        return false;
      }
      return true;
    });
    return emails
        }  
  
  
  
    // Handling different schedule durations
    let schedule = input?.pageData?.scheduleDuration ?? "";
    let time = input?.timeDuration ?? "";
   if(schedule == "" || R.isEmpty(schedule)){
      input.pageData.showScheduleError = false
  input.pageData.scheduleError = "Please Select Schedule"
        throw new Error("Please Select Schedule");
      }
  
    if(time == "" || R.isEmpty(time)){
      input.pageData.showScheduleError = false
  input.pageData.scheduleError = "Please Select valid time"
        throw new Error("Please Select valid time");
      }
  
      let match = time.match(/(\d{1,2}):(\d{2})/);
      let hoursStr, minutesStr;
  
      if (match) {
          hoursStr = match[1]; // First captured group (hours)
          minutesStr = match[2]; // Second captured group (minutes)
      } else {
          // Handle the case where the input doesn't match the expected format
          console.error("Date  is not in valid format"+time);
          throw error;
      }
      let hours = parseInt(hoursStr, 10);
      
        let minutes = 0;
    let scheduleDate = new Date();
    scheduleDate.setHours(hours, minutes, 0, 0);
  
    if (schedule === "Weekly") {
      // Weekly schedule logic
      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const dayOfWeekStr = input?.weekDays ?? "";
      const dayOfWeek = dayNames.indexOf(dayOfWeekStr);
      if (dayOfWeek === -1) {
      input.pageData.showScheduleError = false
  input.pageData.scheduleError = "Invalid day of the week. Please use 'Sunday', 'Monday', etc."
        throw new Error("Invalid day of the week. Please select a day");
      }
      let daysToAdd = dayOfWeek - scheduleDate.getDay();
      if (daysToAdd < 0) daysToAdd += 7;
      scheduleDate.setDate(scheduleDate.getDate() + daysToAdd);
    } else if (schedule === "Monthly") {
      // Monthly schedule logic
      const dayOfMonth = input?.monthDays;
      if (dayOfMonth < 1 || dayOfMonth > 31) {
        input.pageData.showScheduleError = false
  input.pageData.scheduleError = "Invalid day of the month. Please select a day of the month"
  
        throw new Error("Invalid day of the month. Please use a number between 1 and 31.");
      }
      if (dayOfMonth < scheduleDate.getDate()) {
        scheduleDate.setMonth(scheduleDate.getMonth() + 1);
      }
      scheduleDate.setDate(dayOfMonth);
    }
  
    // Formatting the final schedule date for output
  let formattedDate = (scheduleDate instanceof Date && !isNaN(scheduleDate)) ? scheduleDate.toISOString().replace(/:\d+\.\d+Z$/, 'Z') : (console.error("Invalid date:", scheduleDate), "");
    // Processing success emails
    let successEmails = input?.successEmails ?? "";
    input.pageData.successEmails =  input?.pageData?.onStatusSuccess == "Yes" ? extractEmails(successEmails) : ""
  
    // Processing failure emails
    let failureEmails = input?.failureEmails ?? "";
    input.pageData.failureEmails = input?.pageData?.onStatusFailure == "Yes" ?  extractEmails(failureEmails) : ""
  
  
    input.pageData.ascendingImage = {}
      input.pageData.descendingImage = {}
      input.pageData.field = ""
      input.pageData.order = ""
        
    input.pageData.scheduleTime = formattedDate;
    input.pageData.showSchedule = false;
  
    console.log("Input for scheduler", input);
    return true;
  }
  