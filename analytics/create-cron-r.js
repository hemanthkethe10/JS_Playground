module.exports = (input) => {
    let frequency = input.schedule;
    let dateInUST = input.time;
  
  
    try {
      // Validate the frequency input
      if (!["Daily", "Monthly", "Weekly", "Hourly"].includes(frequency)) {
        throw new Error("Invalid frequency. Please use 'Daily', 'Monthly', 'Weekly', or 'Hourly'.");
      }
  
      // Validate and parse the date input
      const parsedDate = new Date(dateInUST);
      if (isNaN(parsedDate)) {
        throw new Error("Invalid date format. Please provide a valid UTC date string.");
      }
  
      // Initialize cron expression components
      let cronExpression = "";
      const hours = parsedDate.getUTCHours();
      const minutes = parsedDate.getUTCMinutes();
  
      // Generate the cron expression based on the frequency
      switch (frequency) {
    case "Daily":
      if (input?.scheduleException?.includes("Weekends")) {
        
          cronExpression = `0 ${minutes} ${hours} ? * MON-FRI`;
      } else {
         
          cronExpression = `0 ${minutes} ${hours} ? * *`;
      }
      break;
  
  
        case "Weekly":
          // Weekly: On a specific day of the week and time
          const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
          const dayOfWeek = daysOfWeek[parsedDate.getUTCDay()];
          cronExpression = `0 ${minutes} ${hours} ? * ${dayOfWeek}`;
          break;
  
        case "Monthly":
          // Monthly: On a specific day and time each month
          const dayOfMonth = parsedDate.getUTCDate();
          cronExpression = `0 ${minutes} ${hours} ${dayOfMonth} * ?`;
          break;
  
        case "Hourly":
          // Hourly: At the same minute every hour
          cronExpression = `0 ${minutes} * * * ?`;
          break;
  
        default:
          throw new Error("Invalid frequency.");
      }
  
      return cronExpression;
    } catch (error) {
      return error.message;
    }
  };
  