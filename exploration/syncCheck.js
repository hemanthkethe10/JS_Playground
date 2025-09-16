function getSyncDetails(input){
    try{
    let jobsResults = input.results;
    let timeOutInMinutes = input.timeOutInMinutes || 120;
    let isSyncRunning = false; //Initial value
    let deltaLink = ''; //Initial value
    let latestRecord = jobsResults.length > 0 ? jobsResults[0] : null;
    let completedExecutions = input.results.filter(job => job.status === 'COMPLETED' || job.status === 'FAILED'); 
    let isInitialSync = !(completedExecutions.length > 0);
    let isLastRunTimedOut = false;
    if (latestRecord) {
    // 2025-05-14T07:03:17.699Z (started_at time fomat)
        isLastRunTimedOut = latestRecord.status === 'RUNNING' && new Date(latestRecord.started_at).getTime() < Date.now() - 1000 * 60 * timeOutInMinutes;
        isSyncRunning = latestRecord.status === 'RUNNING' && !isLastRunTimedOut;
        if (latestRecord.status === 'FAILED') {
        let completedJobsResults = jobsResults.filter(job => job.status === 'COMPLETED');
        deltaLink = completedJobsResults.length > 0 && !isSyncRunning ? completedJobsResults[0].delta_link : '';
        }
        else {
        deltaLink = isSyncRunning ? '' : latestRecord?.delta_link;
       }
    }
    return {
        hasErrors: false,
        data:{
        isSyncRunning,
        deltaLink,
        isInitialSync,
        jobId: latestRecord?.id || '',
        isLastRunTimedOut,
    }}
}
    catch (error) {
        return {
            hasErrors: true,
            error: error
        };
    }
}

module.exports = getSyncDetails;

let input = {"libraryScriptId":"68244d02aed74b904b5a0185","results":[{"id":"37b4c7d4-01f2-48ff-868a-6d8720745d90","started_at":"2025-06-11T15:29:21.496Z","completed_at":"2025-06-11T15:29:42.139Z","status":"COMPLETED","source_system":"SharePoint","destination_system":"S3","client_name":"TestQA2","delta_link":"https%3A%2F%2Fgraph.microsoft.com%2Fv1.0%2Fsites%2Fbackflipt.sharepoint.com%2C8b008f22-de04-489b-ac35-817a1675872f%2Ca5e70746-56da-488f-bf93-bda9ff91b0fb%2Fdrives%2Fb!Io8AiwTem0isNYF6FnWHL0YH56XaVo9Iv5O9qf-RsPt0H17nEQ9HQ5DGUc36K5sq%2Froot%2Fdelta%3Ftoken%3DNDslMjM0OyUyMzE7MztlNzVlMWY3NC0wZjExLTQzNDctOTBjNi01MWNkZmEyYjliMmE7NjM4ODUyNTI1NjExMTcwMDAwOzE1NTk2MzQ1Mzg7JTIzOyUyMzslMjMwOyUyMw","job_type":"SCHEDULER","drive_id":"b!Io8AiwTem0isNYF6FnWHL0YH56XaVo9Iv5O9qf-RsPt0H17nEQ9HQ5DGUc36K5sq","site_id":"backflipt.sharepoint.com,8b008f22-de04-489b-ac35-817a1675872f,a5e70746-56da-488f-bf93-bda9ff91b0fb"},{"id":"fb22517f-9ad3-4b13-ab39-0ec3597d9b66","started_at":"2025-06-11T13:39:18.538Z","completed_at":"2025-06-11T15:39:18.538Z","status":"RUNNING","source_system":"SharePoint","destination_system":"S3","client_name":"TestQA2","delta_link":"https%3A%2F%2Fgraph.microsoft.com%2Fv1.0%2Fsites%2Fbackflipt.sharepoint.com%2C8b008f22-de04-489b-ac35-817a1675872f%2Ca5e70746-56da-488f-bf93-bda9ff91b0fb%2Fdrives%2Fb!Io8AiwTem0isNYF6FnWHL0YH56XaVo9Iv5O9qf-RsPt0H17nEQ9HQ5DGUc36K5sq%2Froot%2Fdelta%3Ftoken%3DNDslMjM0OyUyMzE7MztlNzVlMWY3NC0wZjExLTQzNDctOTBjNi01MWNkZmEyYjliMmE7NjM4ODUyNTMxNTc0NTAwMDAwOzE1NTk2MzUzMDM7JTIzOyUyMzslMjMwOyUyMw","job_type":"SCHEDULER","drive_id":"b!Io8AiwTem0isNYF6FnWHL0YH56XaVo9Iv5O9qf-RsPt0H17nEQ9HQ5DGUc36K5sq","site_id":"backflipt.sharepoint.com,8b008f22-de04-489b-ac35-817a1675872f,a5e70746-56da-488f-bf93-bda9ff91b0fb"}],"timeOutInMinutes":120}

console.log(getSyncDetails(input));