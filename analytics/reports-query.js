module.exports = (input) => {
    let query = `SELECT TO_TIMESTAMP( '1970-01-01 00:00:00', 'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(EventTimestamp / 1000, 'SECOND') AS "DateTime", eventId AS "eventId", cycleid AS "CycleId", parentcycleid AS "ParentCycleId", ISALERT, ISEND, ISEXCEPTION, RETURNMESSAGE, Direction, CASE WHEN IsServer = 0 THEN 'PUSH' WHEN IsServer = 1 AND site != 'N2' THEN 'PULL' WHEN IsServer = 1 AND site = 'N2' THEN 'PUSH' END AS "ArrivalMethod", OriginalSenderId, SenderId, UserId, CASE WHEN UserParameter1 = 'E' THEN 'External' WHEN UserParameter1 = 'I' THEN 'Internal' ELSE 'Not Specified' END AS "SourceType", FinalReceiverId, ReceiverId, Protocol AS "Protocol", ProtocolFileName AS "ProtocolFileName", RemoteAddr, RemoteSAP, ProtocolFileLabel, Filename, Site, CASE WHEN FileSize < 1024 THEN TO_CHAR(FileSize) || ' Bytes' WHEN FileSize < 1024 * 1024 THEN TO_CHAR( ROUND(FileSize / 1024, 1) ) || ' KB' WHEN FileSize < 1024 * 1024 * 1024 THEN TO_CHAR( ROUND( FileSize /(1024 * 1024), 1 ) ) || ' MB' WHEN FileSize < 1024 * 1024 * 1024 * 1024 THEN TO_CHAR( ROUND( FileSize /(1024 * 1024 * 1024), 1 ) ) || ' GB' ELSE TO_CHAR( ROUND( FileSize / (1024 * 1024 * 1024 * 1024), 1 ) ) || ' TB' END AS FileSize FROM XFBTRANSFER_H `;
  
   query+=`WHERE 
    ReceiverId != 'mft-env' 
    AND Protocol != 'AdHOC' `
    let duration = input.reportInfo?.transferDuration?.toLowerCase();
    switch (duration) {
      case "today so far":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE + 1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "yesterday":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE - 1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "this week so far":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE, 'IW') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE + 1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "last week":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE, 'IW') - 7 - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE, 'IW') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "this month so far":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE, 'MM') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE + 1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "last month":
        query += " AND EventTimestamp >= (ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE, 'MM') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "this quarter so far":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE, 'Q') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE + 1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "last quarter":
        query += " AND EventTimestamp >= (ADD_MONTHS(TRUNC(SYSDATE, 'Q'), -3) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE, 'Q') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "this year so far":
        query += " AND EventTimestamp >= (TRUNC(SYSDATE, 'YYYY') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE + 1) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
      case "last year":
        query += " AND EventTimestamp >= (ADD_MONTHS(TRUNC(SYSDATE, 'YYYY'), -12) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000 AND EventTimestamp < (TRUNC(SYSDATE, 'YYYY') - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000";
        break;
        case "custom":
          query += ` AND EventTimestamp >= (CAST((SYSDATE - INTERVAL '${input.reportInfo.customDays}' DAY) AS DATE) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000
    AND EventTimestamp < (CAST(SYSDATE AS DATE) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000`;
          break;
        default:
          query += ` AND EventTimestamp >= (SYSDATE - (1/24) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000`;
          break;
    }
   
   if (input.reportInfo.account) {
  query += ` and ( SenderId = '${input.reportInfo.loginName}' or OriginalSenderId = '${input.reportInfo.loginName}'  or ReceiverId =  '${input.reportInfo.account}' or FinalReceiverId = '${input.reportInfo.account}' ) `  ;
    }
    if (input.reportInfo.businessUnit && input.reportInfo.businessUnit !="NA") {
      query += ` and GroupName = '${input.reportInfo.businessUnit}' `
    }
    if (input.location) {
      query += ` AND Location = '${input.location}'  AND EVENTTIMESTAMP IS NOT NULL `;
    }
   const status =  "('AVAILABLE','POST_PROC/ROUTED','POST_PROC','RECEIVED','SENT','POST_PROC/ARCHIVED','FAILED')";
      query += ` and State in ${status} `
    query += " ORDER BY EventTimestamp desc ";
    if(input.limit){
      query+= ` FETCH FIRST ${input.limit} ROWS ONLY `
    }
  
    return query;
  }