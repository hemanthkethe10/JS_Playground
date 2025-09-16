const cronParser = require('cron-parser');
// import cronParser from 'cron-parser'
const MAX_FAILURE_COUNT = 3;
const RUNNING_THRESHOLD_TIMEOUT = 30 * 60 * 1000; // 0.5 hour

function evaluateCRONExpression (input) {
    let returnObj = {"isEligible":false,"message":""};
    let scheduleType = input.scheduleType;
    //Return the week of the month based on given time
    function getWeekOfMonth(timeInMillis) {
        const date = new Date(timeInMillis);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfMonth = date.getDate();
        const startDay = startOfMonth.getDay();
        const adjustedDate = dayOfMonth + startDay - 1;
        const weekOfMonth = Math.floor(adjustedDate / 7) + 1;         
        return weekOfMonth;
    }
    if (!input.cronExpression) {
        returnObj.message = "Recieved empty cron expression"
        return returnObj;
    }
    //currentTimeInMillis
    const currentTime = new Date().getTime();
    const isEligibleForExecution = () => {
        let interval;
        try {
            interval = cronParser.parseExpression(input.cronExpression,{ utc: true });
        } catch (error) {
            returnObj.message = `Error parsing cron expression ${input.cronExpression}: ${error.message}`
            return false;
        }
        //nextRuntime
        const nextRunTime = interval.next().getTime();
        //Reset the interval
        interval.reset();
        //previousRuntime
        const previousRunTime = interval.prev().getTime();
        returnObj.nextRunTime = nextRunTime;
        returnObj.previousRunTime = previousRunTime;
        const fifteenMinutesAgo = new Date(currentTime - 15 * 60000).getTime();
        const lastRunInMillis = input.lastRun ? new Date(input.lastRun).getTime() : null;
        const lastUpdatedInMillis = input.lastUpdated ? new Date(input.lastUpdated).getTime() : 0;
        //Schedule updated after lastRun
        if (!lastRunInMillis) {
            if(lastUpdatedInMillis > lastRunInMillis)
            {
            //once last edited column is added we will add that condition here.
            returnObj.isEligible = (previousRunTime <= currentTime && lastUpdatedInMillis< previousRunTime) || currentTime>=nextRunTime;
            returnObj.message = "Schedule for this record has been updated recently after last run"
            return returnObj;
            }
            let isEligibleForFirstRun = previousRunTime < fifteenMinutesAgo ? false :(input.createdAt< previousRunTime || input.createdAt< nextRunTime)
            returnObj.isEligible = isEligibleForFirstRun;
            returnObj.message = "First run excluded"
            return returnObj;
        }
        let isLastRunBeforePrevious = lastRunInMillis < previousRunTime;
        if (currentTime >= nextRunTime || isLastRunBeforePrevious || input?.retryCount>0) {
            returnObj.isEligible = true;
            returnObj.message = "Current time is past the next scheduled run";
            return returnObj;
        }
        returnObj.isEligible = (isLastRunBeforePrevious && previousRunTime >= fifteenMinutesAgo && previousRunTime <= currentTime) || currentTime == nextRunTime;
        returnObj.message = "Current Time is less or equal to next runtime";
        return returnObj;
    };

    const isProcessRunningTooLong = () => {
        if (!input.isSchedulerRunning ) {
            return false;
        }
        const runningSince = new Date(input.lastRun).getTime();
        return (currentTime - runningSince) > RUNNING_THRESHOLD_TIMEOUT;
    };
    //This is not implemented in current version
    const effectiveFailureCount = () => {
        const baseCount = input?.retryCount || 0;
        return isProcessRunningTooLong() ? baseCount + 1 : baseCount;
    };

    const isExceedingFailures = effectiveFailureCount() >= MAX_FAILURE_COUNT;
    const isAlreadyRunning = input.isSchedulerRunning;

    if (isProcessRunningTooLong() && !isExceedingFailures) {
    // Indicate that the process needs attention, either for a regular run or because it's been running too long
     returnObj.message = "Process is ruuning more than threshold limit";
     return returnObj;
    }
    let resp = isEligibleForExecution();
    let isEligible = resp.isEligible && !isExceedingFailures && !isAlreadyRunning;
     //Bi-weekly and occurance of day monthly
     if(scheduleType.toLowerCase() === 'bi-weekly'){
        let isExecutedLastWeek = input.isExecutedLastWeek ?? true;
        isEligible = !isExecutedLastWeek && isEligible;
        resp.message = ` ${resp.message} and Bi-weekly output - ${returnObj.isEligible}`
    }
if(scheduleType.toLowerCase() === 'monthly'){
        if(input.type.toLowerCase() === "day of the month"){
            let occurance = parseInt(input.occurance);
            let weekOfMonth = getWeekOfMonth(currentTime);
            isEligible = weekOfMonth === occurance && isEligible;
        }
        resp.message = ` ${resp.message} and Monthly day occurance output - ${returnObj.isEligible}`
    }
//Return the final output
return {"isEligible":isEligible, "message":resp.message, "schedulerInputInfo":resp}
};
module.exports = evaluateCRONExpression