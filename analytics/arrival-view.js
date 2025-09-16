function formArrivalViewOracle(input) {
  let application = input.application || "NYL-AdvancedRoute";
  let isSfrAccount = !input.isLegacy;

  let subQuery = `SELECT coreid AS "SUBCOREID", MAX( CASE WHEN state = 'FAILED' THEN 1 ELSE 0 END) AS has_failed, MAX( CASE WHEN state IN('AVAILABLE', 'FAILED', 'SENT') AND Application = '${application}' THEN 1 ELSE 0 END) AS has_valid_states, COUNT( DISTINCT CASE WHEN state IN('AVAILABLE', 'SENT') THEN state END ) AS count_valid_states FROM ${input.view} WHERE EVENTTIMESTAMP IS NOT NULL`;
  if (isSfrAccount && input?.filter?.businessUnit && input?.filter?.businessUnit.toLowerCase() != "all") {
    subQuery += ` AND GroupName = '${input.filter.businessUnit}' and GroupName is not null `
  }
  if (input?.filter?.status) {
    if (input?.filter?.status.toLowerCase() === "delivered") {
      subQuery += ` AND State IN ('AVAILABLE', 'POST_PROC/ROUTED', 'SENT','RECEIVED','ROUTED')`
    } else if (input?.filter?.status.toLowerCase() === "failed") {
      subQuery += ` AND State IN ('FAILED')`
    }
  }
  // if (!input?.filter?.status) {
  //   subQuery += ` AND State = 'RECEIVED'`
  // }
  if (isSfrAccount && input?.filter?.businessTags) {
    subQuery += ` AND UPPER(BusinessTag) = UPPER('${input.filter.businessTags}')`
  }
  if (input?.filter?.fileName) {
    subQuery += ` AND UPPER(ProtocolFileName) = UPPER('${input.filter.fileName}') and ProtocolFileName is not null `
  }
  if (isSfrAccount && input?.filter?.client && input?.filter?.client.toLowerCase() != "all") {
    subQuery += ` AND UPPER(ClientName) = UPPER('${input.filter.client}')`
  }
  if (isSfrAccount && input?.filter?.partnerName && input?.filter?.partnerName.toLowerCase() != "all") {
    subQuery += ` AND UPPER(PartnerName) = UPPER('${input.filter.partnerName}')`
  }
  if (input?.filter?.partnerAccount && input?.filter?.partnerAccount.toLowerCase() != "all") {
    subQuery += ` AND ( UPPER(SourceAccount) = UPPER('${input.filter.partnerAccount}') OR UPPER(UserId) = UPPER('${input.filter.partnerAccount}'))`
  }
  if (input?.filter?.partnerAccount && input?.filter?.partnerAccount.toLowerCase() === "all" && input?.partnerAccounts?.length > 0) {
      let accountsToString = input.partnerAccounts.map(account => `'${account.accountName}'`).join(', ');
      subQuery += ` AND UserId IN (${accountsToString})`;
    }
  if (isSfrAccount && input?.filter?.fileId && input?.filter?.fileId.toLowerCase() != "all") {
    subQuery += ` AND UPPER(fileId) = UPPER('${input.filter.fileId}')`;
  }
  if (isSfrAccount && input?.filter?.fileIdInfo) {
    if (input?.filter?.fileIdInfo.description.enabled) {
      subQuery += ` AND UPPER(FILEDESCRIPTION) = UPPER('${input.filter.fileIdInfo.description.value}')`;
    }
    if (isSfrAccount && input?.filter?.fileIdInfo.fileNameingPattern.enabled) {
      subQuery += ` AND UPPER(FILENAMEPATTERN) = UPPER('${input.filter.fileIdInfo.fileNameingPattern.value}')`;
     }
    /* if (input?.filter?.fileIdInfo.fileNameingExample.enabled) {
    //      query += ` AND FILENAME = '${input.filter.fileIdInfo.fileNameingExample.value}'`;
    //  }
     if (input?.filter?.fileIdInfo.idType.enabled) {
      subQuery += ` AND UPPER(TYPE) = UPPER('${input.filter.fileIdInfo.idType.value}')`;
     }*/
    if (isSfrAccount && input?.filter?.fileIdInfo.idValue.enabled) {
      subQuery += ` AND UPPER(IDVALUE) = UPPER('${input.filter.fileIdInfo.idValue.value}')`;
    }
    if (isSfrAccount && input?.filter?.fileIdInfo.division.enabled) {
      subQuery += ` AND UPPER(DIVISION) = UPPER('${input.filter.fileIdInfo.division.value}')`;
    }/*
    if (input?.filter?.fileIdInfo.dataSensitivity.enabled) {
      subQuery += ` AND UPPER(DATASENSITIVITY) = UPPER('${input.filter.fileIdInfo.dataSensitivity.value}')`;
    }*/
  }
    //location
    if (input.location) {
      subQuery += ` AND Location = '${input.location}'`;
    }
    if (input.search) {
      /*let fieldsToSearch = ['coreid','cycleid','ProtocolFileName','UserId','Protocol','OriginalSenderId','RemoteAddr'];
      let searchConditions = fieldsToSearch.map(field => `CONTAINS(${field}, '${input.search}', 1) > 0`).join(' or ');*/
      const oracleTextSpecialChars = /[()|~&!{}[\]^"*\?\-:;\/\\+<>=%'#$,._]/g;
      let escaped_search_text = input.search.replace(oracleTextSpecialChars, '\\$&');
      if(input.search.includes('-')) {
        subQuery += ` AND (CONTAINS(STATE, '${escaped_search_text}', 1) > 0) `;
      }
      else if (input.search.includes('\'')) {
        escaped_search_text = escaped_search_text.replace(/'/g, "''");
        subQuery += ` AND (CONTAINS(STATE, '%${escaped_search_text}%', 1) > 0) `;
      }
      else if (containsSeparator(input.search)){
        //escaped_search_text = escaped_search_text.replace(/'/g, "''");
        subQuery += ` AND (CONTAINS(STATE, '"${input.search}"') > 0) `;
      }
      else{
      subQuery += ` AND (CONTAINS(STATE, '%${escaped_search_text}%', 1) > 0) `;
      }
    }
    subQuery += ` GROUP BY coreid`
  // view query
  let query = `WITH subquery AS(${subQuery}) SELECT EVENTID, cycleid AS "CycleId", parentcycleid AS "ParentCycleId", ${input.view}.coreid AS "CoreId", TO_CHAR( TO_DATE('1970-01-01', 'YYYY-MM-DD') +(eventtimestamp / 1000 / 86400), 'MM-DD-YYYY HH24:MI:SS' ) AS "DateTime", CASE WHEN subquery.has_failed = 1 AND subquery.count_valid_states = 0 THEN 'Failure' WHEN subquery.has_failed = 1 AND subquery.count_valid_states > 0 THEN 'Partial Failure' ELSE 'Successful' END AS "Status", ProtocolFileName AS "ProtocolFileName", FileSize AS "FileSize", UserId AS "UserId", Protocol AS "Protocol", CASE WHEN IsServer = 0 THEN 'PUSH' WHEN IsServer = 1 AND site != 'N2' THEN 'PULL' WHEN IsServer = 1 AND site = 'N2' THEN 'PUSH' END AS "ArrivalMethod", CASE UserParameter1 WHEN 'E' THEN 'External' WHEN 'I' THEN 'Internal' ELSE 'Not Specified' END AS "SourceType", GroupName AS "GroupName" FROM ${input.view} LEFT JOIN subquery ON ${input.view}.coreid = subquery.SUBCOREID WHERE eventtimestamp IS NOT NULL `
   
  //status
  query += `AND state = 'RECEIVED' AND COREID IN (SELECT SUBCOREID FROM subquery)`
  //search
  
  //transferDuration
  switch (input.transferDuration?.toLowerCase()) {
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
      query += ` AND EventTimestamp >= ${input.from} AND EventTimestamp < ${input.to}`;
      break;
    default:
      query += " AND 1=1";
      break;
  }
   
  //order-by
  let orderBy = input.orderBy || 'eventtimestamp';
  let order = input.order === 1 ? "ASC" : "DESC";
  if (input.orderBy) {
    query += ` AND ${input.orderBy} IS NOT NULL `
  }
  query += ` ORDER BY ${orderBy} ${order}`

  //Offset
  if (input.offset) {
    query += ` OFFSET ${input.offset} ROWS`;
  }
  //Limit
  if (input.limit) {
    query += ` FETCH FIRST ${input.limit} ROWS ONLY `;

  }
  return query;
}

const stopwords = [
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'has',
  'have', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'let', 'more', 'nor',
  'of', 'on', 'or', 'over', 'so', 'that', 'the', 'to', 'under', 'until', 'when',
  'where', 'which', 'with', 'you', 'your', 'yours', 'while'
];

function containsSeparator(searchString) {
  const words = searchString.toLowerCase().split(/\s+/); 
  for (let word of words) {
    if (stopwords.includes(word)) {
      return true;  
    }
  }
  return false; 
}
module.exports = formArrivalViewOracle;