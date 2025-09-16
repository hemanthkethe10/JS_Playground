function formDestinationViewOracle(input){
    //view,coreId,orderBy,order,limit,offset,location
    let query = `SELECT cycleid as "CycleId", parentcycleid as "ParentCycleId", coreid as "CoreId", TO_CHAR(( TO_DATE('1970-01-01', 'YYYY-MM-DD') + NUMTODSINTERVAL(eventtimestamp / 1000, 'SECOND')), 'MM-DD-YYYY HH24:MI:SS' ) AS "DateTime", ProtocolFileName AS "DeliveredFileName", state AS "Status", ReturnMessage AS "ErrorMessage", FileSize AS "FileSize", ReceiverId AS "Receiver", Protocol as "Protocol", CASE WHEN site = 'N2' THEN 'ST Account: ' || UserId || ' | Folder: ' || VirtualDirName ELSE 'Transfer Site: ' || site END AS "Site" FROM ${input.view} WHERE coreid LIKE '${input.coreId}' AND state IN ('AVAILABLE', 'FAILED', 'SENT') AND EVENTTIMESTAMP IS NOT null `;
    //location
    if(input.location){
        query += ` AND Location = '${input.location}'`
    }
    //order-by
    let orderBy = input.orderBy || 'eventtimestamp';
    let order = input.order || 'desc'
    query += ` ORDER BY ${orderBy} ${order}  `
     //Offset
     if (input.offset){
        query += ` OFFSET ${input.offset} ROWS`;
    }
    //Limit
    if (input.limit){
        query += ` FETCH FIRST ${input.limit} ROWS ONLY `;
    }
   
return query;
}
module.exports = formDestinationViewOracle