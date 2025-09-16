function generateQuery(input) {
  //legacyAccount 
  let isSfrAccount = !input.isLegacyAccount;
  let subQuery = `SELECT coreid AS "SUBCOREID" FROM ${input.viewName} WHERE EVENTTIMESTAMP IS NOT NULL`;

if (input.partnerAccount && input?.partnerAccount.toLowerCase() != "all") {
    subQuery += ` AND (UPPER(SenderId) = UPPER('${input.loginName}') OR UPPER(OriginalSenderId) = UPPER('${input.loginName}') OR UPPER(ReceiverId) = UPPER('${input.partnerAccount}') OR UPPER(FinalReceiverId) = UPPER('${input.partnerAccount}'))`;
}
//not needed for legacyAccount
if (input.businessUnit && input?.businessUnit.toLowerCase() != "all" && input?.businessUnit.toLowerCase() != "na") {
    subQuery += ` AND UPPER(GroupName) = UPPER('${input.businessUnit}')`;
}

if (input.sourceFileName) {
    subQuery += ` AND UPPER(ProtocolFileName) = UPPER('${input.sourceFileName}')`;
}
//not needed for legacyAccount
if (isSfrAccount && input.client && input?.client.toLowerCase() != "all") {
    subQuery += ` AND UPPER(ClientName) = UPPER('${input.client}')`;
}
//not needed for legacyAccount
if (isSfrAccount && input.partnerName && input?.partnerName.toLowerCase() != "all") {
    subQuery += ` AND UPPER(partnerName) = UPPER('${input.partnerName}')`;
}
//not needed for legacyAccount
if (isSfrAccount && input.fileId && input?.fileId.toLowerCase() != "all") {
    subQuery += ` AND UPPER(FILEID) = UPPER('${input.fileId}')`;
}
//not needed for legacyAccount
if (isSfrAccount && input.classifier) {
    subQuery += ` AND UPPER(CLASSIFIER) = UPPER('${input.classifier}')`;
}
//not needed for legacyAccount
if (isSfrAccount && input.fileIdInfo) {
  if (input.fileIdInfo.description.enabled) {
    subQuery += ` AND UPPER(FILEDESCRIPTION) = UPPER('${input.fileIdInfo.description.value}')`;
  }
  //not needed for legacyAccount
  if (isSfrAccount && input.fileIdInfo.fileNameingPattern.enabled) {
    subQuery += ` AND UPPER(FILENAMEPATTERN) = UPPER('${input.fileIdInfo.fileNameingPattern.value}')`;
  }
  //fileNamingExample has been removed because of the patterns used
/*   if (input.fileIdInfo.fileNameingExample.enabled) {
//     query += ` AND FILENAME = '${input.fileIdInfo.fileNameingExample.value}'`;
//   }
  if (input.fileIdInfo.idType.enabled) {
    subQuery += ` AND UPPER(TYPE) = UPPER('${input.fileIdInfo.idType.value}')`;
  }*/
 //not needed for legacyAccount
  if (isSfrAccount && input.fileIdInfo.idValue.enabled) {
    subQuery += ` AND UPPER(IDVALUE) = UPPER('${input.fileIdInfo.idValue.value}')`;
  }
  //not needed for legacyAccount
   if (isSfrAccount && input.fileIdInfo.division.enabled) {
    subQuery += ` AND UPPER(DIVISION) = UPPER('${input.fileIdInfo.division.value}')`;
      }
      if (isSfrAccount && input.fileIdInfo.dataSensitivity.enabled) {
        subQuery += ` AND UPPER(DATASENSITIVITY) = UPPER('${input.fileIdInfo.dataSensitivity.value}')`;
      }
}

if (input.location) {
    subQuery += ` AND Location = '${input.location}'`;
}

if (input.status) {
  if (input.status.toLowerCase() === "delivered") {
    subQuery += ` AND State IN ('AVAILABLE','POST_PROC/ROUTED','SENT','RECEIVED','ROUTED')`;
  }
  if (input.status.toLowerCase() === "failed") {
    subQuery += ` AND State IN ('FAILED')`;
  }
  if (input.status.toLowerCase() === "in progress") {
    subQuery += ` AND State IN ('DECRYPTING', 'ENCRYPTING', 'POST_PROC/ICAP_SCANNING', 'POST_PROC/ROUTING', 'RECEIVING', 'SENDING', 'TO_EXECUTE')`;
  }
  /*const status = input.status === "Delivered" ?
    "('AVAILABLE','POST_PROC/ROUTED','POST_PROC','SENT','POST_PROC/ARCHIVED','RECEIVED')" :
    input.status === "Failed" ? "('FAILED')" : "('RECEIVING','SENDING')";
  query += ` AND State IN ${status}`;*/
} else {
  const status = "('AVAILABLE','POST_PROC/ROUTED','POST_PROC','SENT','POST_PROC/ARCHIVED','FAILED','RECEIVED','RECEIVING','SENDING')";
  subQuery += ` AND State IN ${status}`;
}

if (isSfrAccount && input.businessTag) {
    subQuery += ` AND UPPER(BusinessTags) = UPPER('${input.businessTag}')`;
}
let query = `WITH subquery AS(${subQuery}) SELECT DISTINCT EVENTID FROM ${input.viewName} LEFT JOIN subquery ON ${input.viewName}.coreid = subquery.SUBCOREID WHERE eventtimestamp IS NOT NULL AND ReceiverId != 'mft-env' AND Protocol != 'AdHOC'`;
switch (input.duration.toLowerCase()) {
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
      query += ` AND EventTimestamp >= (CAST((SYSDATE - INTERVAL '${input.customDuration}' DAY(4)) AS DATE) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000
AND EventTimestamp < (CAST(SYSDATE AS DATE) - TO_DATE('1970-01-01', 'YYYY-MM-DD')) * 86400 * 1000`;
      break;
    default:
      query += ` AND 1=1`;
      break;
}
query += ` AND COREID in (select SUBCOREID from subquery)`
let finalQuery = `SELECT COUNT(*) AS "RECORD_COUNT" FROM (${query})`
return finalQuery;
}

let input = {"libraryScriptId":"6684ec116afa0b748455de31","status":"Delivered","sourceFileName":"","businessUnit":"Zebronics","partnerName":"MVR Computers","partnerAccount":"MVRComputers","client":"MVRComputers client","fileId":null,"fileIdInfo":"","businessTag":"part001","duration":"This week so far","customDuration":null,"viewName":"xfbtransfer_h","location":"34235236163","classifier":null,"loginName":"MVRComputers","isLegacyAccount":false,"partnerAccounts":[]}

console.log(generateQuery(input));