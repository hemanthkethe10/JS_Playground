import moment from 'moment-timezone';

function generateCronExpression(input) {
    let  dayOfWeek = parseInt(input.dayOfWeek) ?? "";
    let  dayOfMonthOption =  parseInt(input.dayOfMonth) ?? "";
    let hourRegex = /^([1-9]|1[0-2]):(\d{2}) (am|pm|AM|PM)$/;
    let exemptWeekends = input?.scheduleException?.toLowerCase() === "weekends";
     function extractHourAndMinutes(timeString) {
    // Match the hour using regex
    let match = timeString.match(hourRegex);
    if (match && match[1] && match[3]) {
        let hour = parseInt(match[1]);
        if (match?.at(3)?.toLowerCase() === "pm" && hour !== 12) {
            hour += 12;
        }
        if (match?.at(3)?.toLowerCase() === "am" && hour === 12) {
            hour = 0;
        }
        return {"hours":hour,"minutes":match[2] || 0};
    }
    throw new Error(`Invalid time format - ${timeString}`);
      }
      function isSubset(arr1, arr2) {
        return arr1.every(element => arr2.includes(element));
      }
    let timeAfterExtraction = extractHourAndMinutes(input.hour);
    // Create a moment object in the user's specified time zone
    let userTime = moment.tz({ hour: timeAfterExtraction.hours, minute: timeAfterExtraction.minutes, second: 0, millisecond: 0 }, input.timeZone);
    if (input.scheduleType.toLowerCase() === 'weekly' || input.scheduleType.toLowerCase() === "bi-weekly" || input?.type?.toLowerCase() === 'day of the month'){
        userTime.day(dayOfWeek)
    }
    // Convert the user's time to UTC
    let utcTime = userTime.clone().utc();
    let currentTime = userTime.clone();
    let daysToIndexMap = {"Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6};
    let daysIndexed = (Array.isArray(input.days)) ? input.days.map(it => daysToIndexMap[it]) : daysToIndexMap[input.days];
    let dayDifference = utcTime.day() - currentTime.day();
    console.log(dayDifference);
      if (dayDifference !== 0 && input.scheduleType.toLowerCase() !== 'monthly' && input.scheduleType.toLowerCase() !== 'daily') {
    daysIndexed = daysIndexed.map(dayIndex => {
        let adjustedIndex = dayIndex + dayDifference;
        if (adjustedIndex < 0) {
            adjustedIndex += 7;
        }
        return adjustedIndex % 7;
    });
    }
    
    let days = (Array.isArray(input.days)) ? daysIndexed.join(',') : daysIndexed;    

    // Extract the hour and minute in UTC
    let utcHour = utcTime.hours();
    let utcMinute = utcTime.minutes();
    let utcDayOfWeek = utcTime.day();
    let utcDayOfMonth = utcTime.date();
    let cronExpression;
    switch (input.scheduleType.toLowerCase()) {
        case 'daily':
            cronExpression = exemptWeekends ? `${utcMinute} ${utcHour} * * 1,2,3,4,5`:`${utcMinute} ${utcHour} * * *`;
            break;
        case 'weekly':
            if (isSubset(input.days,Object.keys(daysToIndexMap))){
            cronExpression = `${utcMinute} ${utcHour} * * ${days}`;
            }
            else{
            throw new Error(`Invalid input- ${input.days}`);   
            }
            break;
        case 'bi-weekly':
            //for bi-weekly, we need to update the isExecutedOnLastWeek key in DB
            if (isSubset(input.days,Object.keys(daysToIndexMap))){
                cronExpression = `${utcMinute} ${utcHour} * * ${days}`;
                }
                else{
                throw new Error(`Invalid input- ${input.days}`);   
                }
            break;
        case 'monthly':
            // Check if a specific day of the month is provided
            if(input.type.toLowerCase() === 'day of the month'){
            cronExpression = `${utcMinute} ${utcHour} * * ${utcDayOfWeek}`;
            }
            else{
             console.log(dayOfMonthOption + dayDifference)
             dayOfMonthOption = dayOfMonthOption + dayDifference;
            if (dayOfMonthOption && dayOfMonthOption > 0 && dayOfMonthOption <= 31) {
                cronExpression = exemptWeekends ? `${utcMinute} ${utcHour} ${dayOfMonthOption} * 1,2,3,4,5`:`${utcMinute} ${utcHour} ${dayOfMonthOption} * *`;
            } else {
                cronExpression = exemptWeekends ? `${utcMinute} ${utcHour} ${utcDayOfMonth} * 1,2,3,4,5`:`${utcMinute} ${utcHour} ${utcDayOfMonth} * *`;
            }
        }
            break;
        default:
            throw new Error(`Unsupported schedule type - ${input.scheduleType}`);
    }

    return cronExpression;
}

let input ={"libraryScriptId":"66839ad96afa0b7484549ff6","timeZone":"Asia/Calcutta","hour":"5:00 pm","scheduleType":"Monthly","days":null,"dayOfWeek":null,"dayOfMonth":"30","occurance":null,"type":"Date of the Month","days_multiValue":null}

console.log(generateCronExpression(input))